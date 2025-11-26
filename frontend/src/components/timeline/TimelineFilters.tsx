import { Search, Filter, X } from "lucide-react";
import { useTimeline } from "../../context/TimelineContext";
import { useState } from "react";

export const TimelineFilters = () => {
  const { setSearch, setCategory } = useTimeline();
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearch("");
  };

  const categories = [
    { value: "", label: "All Categories" },
    { value: "GitHub", label: "GitHub" },
    { value: "Meeting", label: "Meeting" },
    { value: "Standup", label: "Standup" },
    { value: "Sprint Review", label: "Sprint Review" },
    { value: "Slack", label: "Slack" },
    { value: "Code", label: "Code" },
    { value: "Personal", label: "Personal" },
    { value: "Travel", label: "Travel" },
    { value: "Music", label: "Music" },
    { value: "Collaboration", label: "Collaboration" },
  ];

  return (
    <div className="mb-10">
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Enhanced Search Bar */}
        <div className="flex-1 relative w-full md:max-w-md">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
              placeholder="Search my entries..."
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all bg-gray-50 hover:bg-white font-medium text-gray-700"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

          {/* Enhanced Category Filter */}
        <div className="w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <select
            onChange={(e) => setCategory(e.target.value)}
                className="w-full md:w-56 pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all bg-gray-50 hover:bg-white font-medium text-gray-700 appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};