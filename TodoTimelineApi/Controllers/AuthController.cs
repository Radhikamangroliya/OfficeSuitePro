using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpGet("google")]
        [AllowAnonymous]
        public IActionResult GoogleLogin([FromQuery] string redirect_uri)
        {
            var url = _auth.GetGoogleOAuthUrl(redirect_uri);
            return Redirect(url);
        }

        [HttpGet("google/callback")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleCallback(
            [FromQuery] string code,
            [FromQuery] string redirect_uri)
        {
            var result = await _auth.ExchangeCodeForTokenAsync(code, redirect_uri);

            return Redirect($"{redirect_uri}?token={result.Token}");
        }

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
