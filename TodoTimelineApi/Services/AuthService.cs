using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using TodoTimelineApi.Data;
using TodoTimelineApi.DTOs;
using TodoTimelineApi.Models;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _db;

        public AuthService(IConfiguration config, AppDbContext db)
        {
            _config = config;
            _db = db;
        }

        // ============================================
        //  GOOGLE LOGIN
        // ============================================
        public async Task<AuthResponse> AuthenticateGoogleAsync(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Authentication:Google:ClientId"]! }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            // Check if user exists
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

            // Create JWT + Refresh
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            var userInfo = new UserInfo(
                Id: user.Id.ToString(),
                Email: user.Email,
                Name: user.DisplayName,
                Picture: user.ProfileImageUrl,
                Provider: user.OAuthProvider
            );

            return new AuthResponse(
                Token: token,
                RefreshToken: refreshToken,
                ExpiresAt: DateTime.UtcNow.AddMinutes(60),
                User: userInfo
            );
        }

        // ============================================
        //  REFRESH TOKEN (not implemented yet)
        // ============================================
        public Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException("Refresh token not implemented in simple version.");
        }

        // ============================================
        //  JWT CREATION
        // ============================================
        public string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            );

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