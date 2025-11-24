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
    <div className="mb-12">
      {/* Date Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
      </div>

      {/* Timeline Items */}
      <div className="relative pl-8 border-l-2 border-gray-200">
        {entries.map((entry, index) => {
          // Handle both PascalCase and camelCase ID
          const entryId = entry.id || entry.Id || index;
          return (
            <div key={entryId} className="relative mb-6 last:mb-0">
              {/* Timeline Dot */}
              <div className="absolute -left-[21px] top-6 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm z-10" />

              {/* Timeline Item */}
              <TimelineItem item={entry} onEdit={onEdit} onDelete={onDelete} />
            </div>
          );
        })}
      </div>
    </div>
  );
};