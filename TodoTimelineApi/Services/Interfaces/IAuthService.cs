using TodoTimelineApi.DTOs;
using TodoTimelineApi.Models;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface IAuthService
    {
        string GetGoogleOAuthUrl(string redirectUri);

        Task<AuthResponse> ExchangeCodeForTokenAsync(string code, string redirectUri);

       
        Task<AuthResponse> AuthenticateGoogleAsync(string idToken);

       
        Task<AuthResponse> AuthenticateWithGoogleAsync(string idToken);

        string GenerateJwtToken(User user);

        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    }
}
