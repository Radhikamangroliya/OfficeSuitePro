import { useTimeline } from "../../context/TimelineContext";

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow p-6 flex-1">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export const TimelineStats = () => {
  const { allEntries } = useTimeline();

  // Calculate Productive hours
  // Assume each entry represents productive work time
  // Average 0.5 hours per entry (can be adjusted)
  const productiveHours = (allEntries.length * 0.5).toFixed(1);

  // Calculate Coding days - unique days with coding-related entries
  const codingCategories = ["Code", "GitHub", "Coding", "Programming", "Development"];
  const codingDays = new Set(
    allEntries
      .filter(entry => {
        const category = entry.category?.toLowerCase() || "";
        return codingCategories.some(cat => category.includes(cat.toLowerCase()));
      })
      .map(entry => {
        const date = new Date(entry.eventDate || entry.createdAt || new Date());
        return date.toDateString();
      })
  ).size;

  // Calculate Collaboration events - entries related to collaboration
  const collaborationCategories = ["Meeting", "Standup", "Collaboration", "Slack", "Team", "Sprint"];
  const collaborationEvents = allEntries.filter(entry => {
    const category = entry.category?.toLowerCase() || "";
    const title = entry.title?.toLowerCase() || "";
    const description = entry.description?.toLowerCase() || "";
    
    return collaborationCategories.some(cat => 
      category.includes(cat.toLowerCase()) ||
      title.includes(cat.toLowerCase()) ||
      description.includes(cat.toLowerCase())
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Productive hours"
        value={`${productiveHours}h`}
      />
      <StatCard
        label="Coding days"
        value={codingDays.toString()}
      />
      <StatCard
        label="Collaboration events"
        value={collaborationEvents.toString()}
      />
    </div>
  );
};