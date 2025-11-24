using System.Threading.Tasks;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface IGithubService
    {
        Task<object> GetGithubActivityAsync(string githubUsername);
    }
}