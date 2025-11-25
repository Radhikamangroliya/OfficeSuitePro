using TodoTimelineApi.DTOs;
using TodoTimelineApi.Models;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface IAuthService
    {
        // Build Google OAuth URL for redirect
        string GetGoogleOAuthUrl(string redirectUri);

        // Exchange Google OAuth authorization code → your own JWT
        Task<AuthResponse> ExchangeCodeForTokenAsync(string code, string redirectUri);

        // Fallback old method (not used now)
        Task<AuthResponse> AuthenticateGoogleAsync(string idToken);

        // Create your JWT token
        string GenerateJwtToken(User user);

        // For refresh token flow
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    }
}
