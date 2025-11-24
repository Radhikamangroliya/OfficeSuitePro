import { List, Calendar } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
      <button
        onClick={() => onViewChange("list")}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
          view === "list"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => onViewChange("calendar")}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
          view === "calendar"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Calendar
      </button>
    </div>
  );
};