import { useState } from "react";
import { useTimeline } from "../../context/TimelineContext";
import { TimelineGroup } from "./TimelineGroup";
import { TimelineEntry } from "../../types/TimelineEntry";
import { formatDateGroup } from "../../utils/formatDate";
import { TimelineEditModal } from "./TimelineEditModal";

export const TimelineList = () => {
  const { entries, loading } = useTimeline();
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const { removeEntry } = useTimeline();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading timeline...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No entries yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Start adding your entries to see them here
          </p>
        </div>
      </div>
    );
  }

  // Group entries by date
  const groupedEntries: { [key: string]: TimelineEntry[] } = {};

  entries.forEach((entry) => {
    // Handle both PascalCase and camelCase property names
    const dateKey = entry.EventDate || entry.eventDate || entry.CreatedAt || entry.createdAt || new Date().toISOString();
    const formattedDate = formatDateGroup(dateKey);

    if (!groupedEntries[formattedDate]) {
      groupedEntries[formattedDate] = [];
    }

    groupedEntries[formattedDate].push(entry);
  });

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    const entryA = groupedEntries[a][0];
    const entryB = groupedEntries[b][0];
    // Handle both PascalCase and camelCase property names
    const dateA = new Date(
      entryA?.EventDate || entryA?.eventDate || entryA?.CreatedAt || entryA?.createdAt || new Date().toISOString()
    );
    const dateB = new Date(
      entryB?.EventDate || entryB?.eventDate || entryB?.CreatedAt || entryB?.createdAt || new Date().toISOString()
    );
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <div className="max-w-4xl">
        {sortedDates.map((date) => (
          <TimelineGroup
            key={date}
            date={date}
            entries={groupedEntries[date]}
            onEdit={setEditingEntry}
            onDelete={removeEntry}
          />
      ))}
    </div>

      {editingEntry && (
        <TimelineEditModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
};