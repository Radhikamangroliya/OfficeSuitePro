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
      const eventDate = entry.EventDate || entry.eventDate;
      const createdAt = entry.CreatedAt || entry.createdAt;
      
      if (!eventDate && !createdAt) return false;
      
      const entryDate = new Date(eventDate || createdAt);
      if (isNaN(entryDate.getTime())) return false;
      
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    })
    .sort((a, b) => {
      // Handle both PascalCase and camelCase property names
      const dateA = new Date(a.EventDate || a.eventDate || a.CreatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.EventDate || b.eventDate || b.CreatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 10);

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

    if (category.includes("github") || title.includes("github") || title.includes("upload")) {
      return <Upload className="w-4 h-4 text-gray-800" />;
    }
    if (category.includes("meeting") || title.includes("meeting") || title.includes("completed")) {
      return <CheckCircle2 className="w-4 h-4 text-gray-800" />;
    }
    if (category.includes("slack") || title.includes("slack") || title.includes("comment")) {
      return <MessageSquarePlus className="w-4 h-4 text-gray-800" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-gray-800" />;
  };

  const formatActivityText = (entry: any) => {
    // Handle both PascalCase and camelCase property names
    const displayTitle = entry.Title || entry.title || "";
    const description = entry.Description || entry.description || "";
    
    // Return the title, or description if no title
    return displayTitle || description || "Untitled entry";
  };

  // Map actual timeline entries to activities
  const activities = todaysEntries.map((entry, index) => {
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
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-5">My Today</h3>
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