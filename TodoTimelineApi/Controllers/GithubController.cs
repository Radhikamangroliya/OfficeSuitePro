using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GithubController : ControllerBase
    {
        private readonly IGithubService _githubService;

        public GithubController(IGithubService githubService)
        {
            _githubService = githubService;
        }

        // GET: /api/github/activity?username=RadhikaMangroliya
        [HttpGet("activity")]
        [Authorize] // protect with JWT
        public async Task<IActionResult> GetGithubActivity(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest("GitHub username is required.");

            var result = await _githubService.GetGithubActivityAsync(username);
            return Ok(result);
        }
    }
}