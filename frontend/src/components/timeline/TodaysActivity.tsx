import { Upload, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { useTimeline } from "../../context/TimelineContext";

export const TodaysActivity = () => {
  const { allEntries } = useTimeline();

  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ensure allEntries is an array
  const entries = Array.isArray(allEntries) ? allEntries : [];

  const todaysEntries = entries
    .filter(entry => {
      // Handle both PascalCase and camelCase property names
      const entryDate = new Date(entry.EventDate || entry.eventDate || entry.CreatedAt || entry.createdAt || new Date());
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    })
    .sort((a, b) => {
      // Handle both PascalCase and camelCase property names
      const dateA = new Date(a.EventDate || a.eventDate || a.CreatedAt || a.createdAt || new Date()).getTime();
      const dateB = new Date(b.EventDate || b.eventDate || b.CreatedAt || b.createdAt || new Date()).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getActivityIcon = (entry: any) => {
    // Handle both PascalCase and camelCase property names
    const category = (entry.Category || entry.category || "").toLowerCase();
    const title = (entry.Title || entry.title || "").toLowerCase();

    if (category.includes("github") || title.includes("upload")) {
      return <Upload className="w-4 h-4 text-red-600" />;
    }
    if (category.includes("meeting") || title.includes("completed")) {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    if (category.includes("slack") || title.includes("comment")) {
      return <MessageSquarePlus className="w-4 h-4 text-red-600" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
  };

  const formatActivityText = (entry: any) => {
    // Handle both PascalCase and camelCase property names
    const category = (entry.Category || entry.category || "").toLowerCase();
    const title = (entry.Title || entry.title || "").toLowerCase();
    const displayTitle = entry.Title || entry.title || "";

    if (title.includes("upload")) {
      return `You uploaded ${displayTitle}`;
    }
    if (title.includes("completed")) {
      return `You completed ${displayTitle}`;
    }
    if (title.includes("comment")) {
      return `New comment in ${displayTitle}`;
    }
    return displayTitle;
  };

  // Sample activities if no entries today
  const sampleActivities = [
    {
      id: "sample-1",
      text: "Jane uploaded Marketing.pdf",
      icon: <Upload className="w-4 h-4 text-red-600" />,
      time: "1h ago",
    },
    {
      id: "sample-2",
      text: "You completed Redesign homepage",
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      time: "Apr 24",
    },
    {
      id: "sample-3",
      text: "New comment in ⇥ttalling",
      icon: <MessageSquarePlus className="w-4 h-4 text-red-600" />,
      time: "Apr 24",
    },
  ];

  const activities = todaysEntries.length > 0
    ? todaysEntries.map((entry, index) => {
        // Handle both PascalCase and camelCase property names, with safe fallback for ID
        const entryId = entry.id || entry.Id || entry.id?.toString() || entry.Id?.toString() || `entry-${index}-${Date.now()}`;
        const eventDate = entry.EventDate || entry.eventDate;
        const createdAt = entry.CreatedAt || entry.createdAt;
        const dateString = eventDate || createdAt || new Date().toISOString();
        
        return {
          id: entryId.toString(),
          text: formatActivityText(entry),
          icon: getActivityIcon(entry),
          time: getTimeAgo(dateString),
        };
      })
    : sampleActivities;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-5">Today's Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 leading-relaxed">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No activity today</p>
          </div>
        )}
      </div>
    </div>
  );
};