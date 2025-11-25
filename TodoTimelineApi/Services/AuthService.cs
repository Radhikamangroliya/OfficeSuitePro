using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TodoTimelineApi.Data;
using TodoTimelineApi.DTOs;
using TodoTimelineApi.Models;
using TodoTimelineApi.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace TodoTimelineApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _db;
        private readonly HttpClient _http;

        public AuthService(IConfiguration config, AppDbContext db)
        {
            _config = config;
            _db = db;
            _http = new HttpClient();
        }

        public string GetGoogleOAuthUrl(string redirectUri)
        {
            var clientId = _config["Authentication:Google:ClientId"];
            var scopes = "openid email profile";

            return
                "https://accounts.google.com/o/oauth2/v2/auth" +
                "?response_type=code" +
                $"&client_id={clientId}" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                $"&scope={Uri.EscapeDataString(scopes)}" +
                "&access_type=offline" +
                "&prompt=consent";
        }

        public async Task<AuthResponse> ExchangeCodeForTokenAsync(string code, string redirectUri)
        {
            try
            {
                var clientId = _config["Authentication:Google:ClientId"];
                var clientSecret = _config["Authentication:Google:ClientSecret"];

                var payloadData = new Dictionary<string, string>()
                {
                    { "code", code },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                };

                var response = await _http.PostAsync(
                    "https://oauth2.googleapis.com/token",
                    new FormUrlEncodedContent(payloadData)
                );

                var json = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception("Google token exchange failed: " + json);

                var google = JsonSerializer.Deserialize<GoogleOAuthResponse>(json);

                var payload = await GoogleJsonWebSignature.ValidateAsync(google.id_token);

                var user = await _db.Users
                    .FirstOrDefaultAsync(u => u.OAuthProvider == "Google" && u.OAuthId == payload.Subject);

                if (user == null)
                {
                    user = new User
                    {
                        OAuthProvider = "Google",
                        OAuthId = payload.Subject,
                        Email = payload.Email,
                        DisplayName = payload.Name,
                        ProfileImageUrl = payload.Picture,
                        CreatedAt = DateTime.UtcNow,
                        LastLoginAt = DateTime.UtcNow
                    };

                    _db.Users.Add(user);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    user.LastLoginAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }

                var jwt = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                return new AuthResponse(
                    Token: jwt,
                    RefreshToken: refreshToken,
                    ExpiresAt: DateTime.UtcNow.AddMinutes(60),
                    User: new UserInfo(
                        Id: user.Id.ToString(),
                        Email: user.Email,
                        Name: user.DisplayName,
                        Picture: user.ProfileImageUrl,
                        Provider: user.OAuthProvider
                    )
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("Google OAuth error: " + ex);
                throw;
            }
        }

        private class GoogleOAuthResponse
        {
            public string access_token { get; set; }
            public string id_token { get; set; }
            public string refresh_token { get; set; }
        }

        public Task<AuthResponse> AuthenticateGoogleAsync(string idToken)
        {
            throw new NotImplementedException("Use redirect login.");
        }

        public Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException();
        }

        public string GenerateJwtToken(User user)
        {
            var key = Convert.FromBase64String(_config["Jwt:Key"]);
            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim("email", user.Email ?? ""),
                new Claim("name", user.DisplayName ?? ""),
                new Claim("provider", user.OAuthProvider ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var bytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }
    }
}
