import { useTimeline } from "../../context/TimelineContext";

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex-1">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">{label}</p>
        <p className="text-4xl font-bold text-white mb-1">{value}</p>
        <div className="mt-4 h-1 w-16 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
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
        label="My Productive Hours"
        value={`${productiveHours}h`}
      />
      <StatCard
        label="My Coding Days"
        value={codingDays.toString()}
      />
      <StatCard
        label="My Collaborations"
        value={collaborationEvents.toString()}
      />
    </div>
  );
};