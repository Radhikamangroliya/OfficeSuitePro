import { Download, Upload, RefreshCw } from "lucide-react";
import { useTimeline } from "../../context/TimelineContext";

export const QuickActions = () => {
  const { entries } = useTimeline();

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeline-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export my timeline"
      >
        <Download className="w-4 h-4" />
        <span className="hidden md:inline">Export</span>
      </button>
      <button
        onClick={handleRefresh}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh my timeline"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden md:inline">Refresh</span>
      </button>
    </div>
  );
};