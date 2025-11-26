import { TimelineEntry } from "../../types/TimelineEntry";
import { TimelineItem } from "./TimelineItem";

interface TimelineGroupProps {
  date: string;
  entries: TimelineEntry[];
  onEdit?: (item: TimelineEntry) => void;
  onDelete?: (id: number) => void;
}

export const TimelineGroup = ({ date, entries, onEdit, onDelete }: TimelineGroupProps) => {
  return (
    <div className="mb-16">
      {/* Enhanced Date Header */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-lg">
            <h2 className="text-base font-bold text-white tracking-wide">{date}</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-2 h-2 bg-gray-800 rounded-full"></div>
      </div>

      {/* Enhanced Timeline Items */}
      <div className="relative pl-12">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300"></div>
        
        {entries.map((entry, index) => {
          // Handle both PascalCase and camelCase ID
          const entryId = entry.id || (entry as any).Id || index;
          const isLast = index === entries.length - 1;
          return (
            <div key={entryId} className="relative mb-8 last:mb-0">
              {/* Enhanced Timeline Dot */}
              <div className="absolute -left-[29px] top-8 z-20">
                <div className="relative">
                  <div className="w-5 h-5 bg-white border-4 border-gray-800 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-5 h-5 bg-gray-800 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              {/* Connecting Line (not for last item) */}
              {!isLast && (
                <div className="absolute -left-[26px] top-14 w-0.5 h-full bg-gradient-to-b from-gray-400 to-gray-300"></div>
              )}

              {/* Timeline Item */}
              <TimelineItem item={entry} onEdit={onEdit} onDelete={onDelete} />
            </div>
          );
        })}
      </div>
    </div>
  );
};