using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoTimelineApi.DTOs;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // =========================================
        //  GOOGLE LOGIN
        // =========================================
        [HttpPost("google")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var result = await _authService.AuthenticateGoogleAsync(request.IdToken);
            return Ok(result);
        }

        // =========================================
        //  GET CURRENT USER
        // =========================================
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var id = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var email = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            var name = User.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
            var provider = User.Claims.FirstOrDefault(c => c.Type == "provider")?.Value;

            return Ok(new { id, email, name, provider });
        }
    }
}