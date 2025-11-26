using System.Threading.Tasks;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface IGithubService
    {
        Task<object> GetGithubActivityAsync(string githubUsername);
        Task<object> GetGithubProfileAsync(string githubUsername);
        Task<object> GetGithubReposAsync(string githubUsername);
        Task<object> GetGithubContributionsAsync(string githubUsername);
        Task<object> GetGithubCommitsAsync(string githubUsername, string repo);
    }
}