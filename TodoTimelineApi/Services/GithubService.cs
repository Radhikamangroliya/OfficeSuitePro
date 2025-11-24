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

        public async Task<object> GetGithubActivityAsync(string githubUsername)
        {
            var token = _config["Github:Token"]; // from appsettings.json

            // GitHub API endpoint
            string url = $"https://api.github.com/users/{githubUsername}/events";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.UserAgent.Add(new ProductInfoHeaderValue("MyApp", "1.0"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return new { error = "Failed to fetch GitHub activity." };

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<object>(json);

            return result;
        }
    }
}