import { useTimeline } from "../../context/TimelineContext";

export const ActivitySummary = () => {
  const { allEntries } = useTimeline();

  // Calculate stats from actual entries
  const totalEntries = allEntries.length;
  const categories = new Set(allEntries.map(e => e.category).filter(Boolean));
  const uniqueCategories = categories.size;

  // Calculate entries from last 7 days
  const last7Days = allEntries.filter(entry => {
    const entryDate = new Date(entry.eventDate || entry.createdAt || new Date());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entryDate >= sevenDaysAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="group relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Total Entries</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{totalEntries}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-gray-800 to-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="group relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Categories</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{uniqueCategories}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-gray-800 to-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="group relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Last 7 Days</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{last7Days}</p>
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-gray-800 to-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};