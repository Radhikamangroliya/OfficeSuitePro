using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TodoTimelineApi.DTOs;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        private readonly IConfiguration _config;

        public AuthController(IAuthService auth, IConfiguration config)
        {
            _auth = auth;
            _config = config;
        }

        // 🎯 1) Google OAuth Redirect URL
        // Returns redirect to Google OAuth URL for browsers
        // Returns JSON with OAuth URL when Accept: application/json header is present (for Swagger/testing)
        [HttpGet("google")]
        [AllowAnonymous]
        public IActionResult GoogleLogin([FromQuery] string? format)
        {
            var redirectUri = _config["Authentication:Google:RedirectUri"];
            var url = _auth.GetGoogleOAuthUrl(redirectUri);
            
            // Check if client wants JSON response (Swagger, API clients)
            // This happens when:
            // 1. format=json query parameter is specified, OR
            // 2. Accept header contains application/json (Swagger sends this)
            var acceptHeader = Request.Headers["Accept"].ToString();
            var wantsJson = format?.ToLower() == "json" || 
                           acceptHeader.Contains("application/json", StringComparison.OrdinalIgnoreCase);
            
            if (wantsJson)
            {
                return Ok(new
                {
                    oauthUrl = url,
                    redirectUri = redirectUri,
                    message = "Use this URL to initiate Google OAuth flow. In a browser, this endpoint redirects automatically."
                });
            }
            
            // Default behavior: redirect to Google OAuth (for browsers)
            return Redirect(url);
        }

        // 🎯 2) Google OAuth Callback (only used when using full OAuth flow)
        [HttpGet("google/callback")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleCallback([FromQuery] string? code, [FromQuery] string? error)
        {
            var backendRedirectUri = _config["Authentication:Google:RedirectUri"];
            var frontendRedirectUri = _config["Authentication:Google:FrontendRedirectUri"] ?? "http://localhost:5173/oauth-callback";
            
            if (!string.IsNullOrEmpty(error))
            {
                return Redirect($"{frontendRedirectUri}?error={Uri.EscapeDataString(error)}");
            }

            if (string.IsNullOrEmpty(code))
            {
                return Redirect($"{frontendRedirectUri}?error=No authorization code received");
            }

            try
            {
                var result = await _auth.ExchangeCodeForTokenAsync(code, backendRedirectUri);
                return Redirect($"{frontendRedirectUri}?token={result.Token}");
            }
            catch (Exception ex)
            {
                return Redirect($"{frontendRedirectUri}?error={Uri.EscapeDataString(ex.Message)}");
            }
        }

        // 🎯 3) DIRECT ID-TOKEN LOGIN (Frontend sends idToken)
        [HttpPost("google/token")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleTokenLogin([FromBody] GoogleTokenDto dto)
        {
            if (string.IsNullOrEmpty(dto.IdToken))
            {
                return BadRequest(new { message = "IdToken is required" });
            }

            try
            {
                var result = await _auth.AuthenticateWithGoogleAsync(dto.IdToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🎯 4) Get Current User from JWT
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            return Ok(new
            {
                id = User.FindFirst("id")?.Value,
                email = User.FindFirst("email")?.Value,
                name = User.FindFirst("name")?.Value
            });
        }
    }
}
