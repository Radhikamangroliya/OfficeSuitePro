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
        [Authorize]
        public async Task<IActionResult> GetGithubActivity(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest("GitHub username is required.");

            var result = await _githubService.GetGithubActivityAsync(username);
            return Ok(result);
        }

        // GET: /api/github/profile?username=RadhikaMangroliya
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetGithubProfile(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest("GitHub username is required.");

            var result = await _githubService.GetGithubProfileAsync(username);
            return Ok(result);
        }

        // GET: /api/github/repos?username=RadhikaMangroliya
        [HttpGet("repos")]
        [Authorize]
        public async Task<IActionResult> GetGithubRepos(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest("GitHub username is required.");

            var result = await _githubService.GetGithubReposAsync(username);
            return Ok(result);
        }

        // GET: /api/github/contributions?username=RadhikaMangroliya
        [HttpGet("contributions")]
        [Authorize]
        public async Task<IActionResult> GetGithubContributions(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest("GitHub username is required.");

            var result = await _githubService.GetGithubContributionsAsync(username);
            return Ok(result);
        }

        // GET: /api/github/commits?username=RadhikaMangroliya&repo=repo-name
        [HttpGet("commits")]
        [Authorize]
        public async Task<IActionResult> GetGithubCommits(string username, string repo)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(repo))
                return BadRequest("GitHub username and repository name are required.");

            var result = await _githubService.GetGithubCommitsAsync(username, repo);
            return Ok(result);
        }
    }
}