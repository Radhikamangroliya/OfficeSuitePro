using TodoTimelineApi.DTOs;
using TodoTimelineApi.Models;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> AuthenticateGoogleAsync(string idToken);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        string GenerateJwtToken(User user);
    }
}