import { List, Calendar } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewChange("list")}
        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          view === "list"
            ? "bg-gray-800 text-white hover:bg-gray-900"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => onViewChange("calendar")}
        className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          view === "calendar"
            ? "bg-gray-800 text-white hover:bg-gray-900"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Calendar
      </button>
    </div>
  );
};