import { useEffect, useState } from "react";
import { getGithubActivity } from "../../api/github";

function GithubWidget() {
  const [username, setUsername] = useState("Radhikamangroliya");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getGithubActivity(username);
      setEvents(data.slice(0, 5));
    } catch (error) {
      console.error("GitHub fetch failed", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">GitHub Activity</h3>

      {/* Username Search Box */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchEvents}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {events.map((event, i) => (
            <li key={i} className="mb-2">
              <strong>{event.type}</strong>
              <br />
              <span className="text-gray-600 text-sm">
                {event.repo?.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GithubWidget;