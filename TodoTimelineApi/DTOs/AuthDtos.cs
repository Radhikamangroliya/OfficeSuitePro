namespace TodoTimelineApi.DTOs
{
    // Used ONLY for: POST /api/auth/google/token
    public class GoogleTokenDto
    {
        public string IdToken { get; set; } = string.Empty;
    }

    // Old OAuth code-flow DTO (still optional)
    public record GoogleLoginRequest(string IdToken);

    public record MicrosoftLoginRequest(string Code);

    public record UserInfo(
        string Id,
        string Email,
        string Name,
        string? Picture,
        string Provider
    );

    public record AuthResponse(
        string Token,
        string RefreshToken,
        DateTime ExpiresAt,
        UserInfo User
    );

    public record RefreshTokenRequest(string RefreshToken);
}
