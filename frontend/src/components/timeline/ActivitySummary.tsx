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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalEntries}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueCategories}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{last7Days}</p>
        </div>
      </div>
    </div>
  );
};