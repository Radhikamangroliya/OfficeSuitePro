import { useEffect, useState } from "react";
import {
  getGithubProfile,
  getGithubRepos,
  getGithubContributions,
  getGithubActivity,
} from "../../api/github";
import {
  Github,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  GitBranch,
  GitPullRequest,
  Code,
  Star,
  Eye,
  Search,
  TrendingUp,
  FileCode,
  GitCommit,
  AlertCircle,
} from "lucide-react";

interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  location: string;
  blog: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
  default_branch: string;
}

export default function GithubDashboard() {
  const [username, setUsername] = useState("Radhikamangroliya");
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubData = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel with better error handling
      const results = await Promise.allSettled([
        getGithubProfile(username),
        getGithubRepos(username),
        getGithubContributions(username),
      ]);

      // Handle profile
      if (results[0].status === "fulfilled" && results[0].value && !results[0].value.error) {
        setProfile(results[0].value as GitHubProfile);
      } else {
        const errorMsg = results[0].status === "rejected" 
          ? results[0].reason?.response?.status === 404 
            ? "GitHub profile not found. Please check the username."
            : results[0].reason?.message || "Failed to fetch profile"
          : "Failed to fetch profile";
        throw new Error(errorMsg);
      }

      // Handle repos
      if (results[1].status === "fulfilled" && Array.isArray(results[1].value) && results[1].value.length > 0) {
        setRepos(results[1].value.slice(0, 10) as GitHubRepo[]);
      } else {
        setRepos([]);
      }

      // Handle contributions/events
      if (results[2].status === "fulfilled" && Array.isArray(results[2].value) && results[2].value.length > 0) {
        setEvents(results[2].value.slice(0, 20) as any[]);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error("GitHub fetch failed", err);
      let errorMessage = "Failed to fetch GitHub data";
      
      if (err.message?.includes("No authentication token")) {
        errorMessage = "Please log in to view GitHub data.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 404) {
        errorMessage = "GitHub API endpoint not found. The backend may need to be restarted.";
      } else if (err.response?.status === 403) {
        errorMessage = "Access forbidden. Check your GitHub token configuration.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProfile(null);
      setRepos([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchGitHubData();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGitHubData();
  };

  // Calculate stats from events
  const stats = {
    commits: events.filter((e) => e.type === "PushEvent").length,
    prs: events.filter((e) => e.type === "PullRequestEvent").length,
    issues: events.filter((e) => e.type === "IssuesEvent").length,
    repos: repos.length,
  };

  // Language distribution - Show ALL languages
  const languages: { [key: string]: number } = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  const allLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search my GitHub profile..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && !profile && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="text-gray-600 mt-4">Loading GitHub profile...</p>
        </div>
      )}

      {profile && (
        <>
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
              <div className="flex items-start gap-6">
                <img
                  src={profile.avatar_url}
                  alt={profile.name || profile.login}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1">{profile.name || profile.login}</h2>
                  <p className="text-gray-300 mb-3">@{profile.login}</p>
                  {profile.bio && <p className="text-gray-200 mb-4">{profile.bio}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.blog && (
                      <a
                        href={profile.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <FileCode className="w-4 h-4" />
                  <span className="text-sm">Repositories</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.public_repos}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Followers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.followers}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Following</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.following}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <Code className="w-4 h-4" />
                  <span className="text-sm">Gists</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile.public_gists}</p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <GitCommit className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{stats.commits}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium">Commits</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <GitPullRequest className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{stats.prs}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium">Pull Requests</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{stats.issues}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium">Issues</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{stats.repos}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium">Active Repos</p>
            </div>
          </div>

          {/* Languages & Repositories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* All Languages */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-gray-800" />
                All Languages
              </h3>
              {allLanguages.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allLanguages.map(([lang, count]) => (
                    <div key={lang}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{lang}</span>
                        <span className="text-sm text-gray-500">{count} repos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-800 h-2 rounded-full"
                          style={{ width: `${(count / repos.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No language data available</p>
              )}
            </div>

            {/* Recent Repositories */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Github className="w-5 h-5 text-gray-800" />
                Recent Repositories
              </h3>
              {repos.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {repos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 hover:text-gray-800 transition-colors">
                            {repo.name}
                          </h4>
                          {repo.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {repo.forks_count}
                        </span>
                        {repo.open_issues_count > 0 && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {repo.open_issues_count}
                          </span>
                        )}
                        <span className="ml-auto">
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No repositories found</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          {events.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-800" />
                Recent Activity
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.slice(0, 15).map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {event.type === "PushEvent" && (
                        <GitCommit className="w-5 h-5 text-gray-800" />
                      )}
                      {event.type === "PullRequestEvent" && (
                        <GitPullRequest className="w-5 h-5 text-gray-800" />
                      )}
                      {event.type === "IssuesEvent" && (
                        <AlertCircle className="w-5 h-5 text-gray-800" />
                      )}
                      {!["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type) && (
                        <Code className="w-5 h-5 text-gray-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {event.type?.replace("Event", "") || "Activity"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {event.repo?.name || "Repository"}
                      </p>
                      {event.created_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

