import GithubDashboard from "../components/github/GithubDashboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My GitHub
          </h1>
          <p className="text-gray-600 text-lg">Your development activity, contributions, and repositories</p>
        </div>

        {/* GitHub Dashboard Component */}
        <GithubDashboard />
      </div>
    </div>
  );
}