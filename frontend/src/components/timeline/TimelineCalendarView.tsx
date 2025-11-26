import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useTimeline } from "../../context/TimelineContext";
import { TimelineEntry } from "../../types/TimelineEntry";

export const TimelineCalendarView = () => {
  const { entries } = useTimeline();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get entries for a specific date
  const getEntriesForDate = (date: Date): TimelineEntry[] => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(entry => {
      const eventDate = entry.EventDate || entry.eventDate;
      const createdAt = entry.CreatedAt || entry.createdAt;
      const entryDate = eventDate || createdAt;
      
      if (!entryDate) return false;
      const entryDateStr = new Date(entryDate).toISOString().split('T')[0];
      return entryDateStr === dateStr;
    });
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(year, month + (direction === "next" ? 1 : -1), 1));
  };

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-700 py-2 text-sm"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const dayEntries = getEntriesForDate(date);
          const isTodayDate = isToday(date);

          const handleEntryClick = (entry: TimelineEntry, e: React.MouseEvent) => {
            e.stopPropagation();
            const entryId = entry.id || (entry as any).Id;
            if (entryId) {
              navigate(`/workspace/${entryId}`);
            }
          };

          return (
            <div
              key={date.toISOString()}
              className={`
                aspect-square p-2 rounded-xl border-2 transition-all relative
                ${isTodayDate 
                  ? "border-gray-800 bg-gray-50 font-bold" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div className={`text-sm mb-1 ${isTodayDate ? "text-gray-900" : "text-gray-700"}`}>
                {date.getDate()}
              </div>
              {dayEntries.length > 0 && (
                <div className="space-y-1">
                  {dayEntries.slice(0, 3).map((entry, idx) => {
                    const title = entry.Title || entry.title || "Untitled";
                    const entryId = entry.id || (entry as any).Id;
                    return (
                      <div
                        key={idx}
                        onClick={(e) => handleEntryClick(entry, e)}
                        className="text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-gray-900 transition-colors"
                        title={title}
                      >
                        {title}
                      </div>
                    );
                  })}
                  {dayEntries.length > 3 && (
                    <div className="text-xs text-gray-600 font-medium">
                      +{dayEntries.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-gray-800 bg-gray-50"></div>
            <span className="text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-gray-200"></div>
            <span className="text-gray-700">Other days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-800"></div>
            <span className="text-gray-700">Has entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

