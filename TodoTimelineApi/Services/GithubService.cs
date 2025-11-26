using System.Net.Http.Headers;
using System.Text.Json;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Services
{
    public class GithubService : IGithubService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GithubService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _config = config;
        }

        private async Task<object> MakeGitHubRequest(string url)
        {
            var token = _config["Github:Token"];
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.UserAgent.Add(new ProductInfoHeaderValue("MyApp", "1.0"));
            if (!string.IsNullOrEmpty(token))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return new { error = $"Failed to fetch from GitHub API. Status: {response.StatusCode}" };

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<object>(json) ?? new { error = "Empty response from GitHub" };
        }

        public async Task<object> GetGithubActivityAsync(string githubUsername)
        {
            string url = $"https://api.github.com/users/{githubUsername}/events/public";
            return await MakeGitHubRequest(url);
        }

        public async Task<object> GetGithubProfileAsync(string githubUsername)
        {
            string url = $"https://api.github.com/users/{githubUsername}";
            return await MakeGitHubRequest(url);
        }

        public async Task<object> GetGithubReposAsync(string githubUsername)
        {
            string url = $"https://api.github.com/users/{githubUsername}/repos?sort=updated&per_page=100";
            return await MakeGitHubRequest(url);
        }

        public async Task<object> GetGithubContributionsAsync(string githubUsername)
        {
            // GitHub doesn't have a direct API for contribution graph, but we can get events and calculate
            // For now, return recent activity which can be used to show contributions
            string url = $"https://api.github.com/users/{githubUsername}/events/public?per_page=100";
            return await MakeGitHubRequest(url);
        }

        public async Task<object> GetGithubCommitsAsync(string githubUsername, string repo)
        {
            string url = $"https://api.github.com/repos/{githubUsername}/{repo}/commits?author={githubUsername}&per_page=30";
            return await MakeGitHubRequest(url);
        }
    }
}