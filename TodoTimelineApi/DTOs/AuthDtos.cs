namespace TodoTimelineApi.DTOs;

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