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
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search entries..."
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
  );
};