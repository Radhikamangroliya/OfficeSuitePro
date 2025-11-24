import { useEffect, useState } from "react";
import "./GoogleCalendar.css";

interface GoogleCalendarViewProps {
  accessToken: string;
}

interface CalendarEvent {
  id: string;
  summary?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export default function GoogleCalendarView({ accessToken }: GoogleCalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:5007/api/google-calendar/upcoming?accessToken=${accessToken}`
        );
        const data = await res.json();

        setEvents(data.items || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  if (loading) return <div className="gc-loading">Loading Google Calendar...</div>;

  return (
    <div className="gc-container">
      <h2 className="gc-title">📅 Google Calendar Events</h2>

      {events.length === 0 ? (
        <div className="gc-empty">No upcoming events.</div>
      ) : (
        <div className="gc-events-list">
          {events.map((event) => {
            const start = event.start.dateTime || event.start.date;
            const end = event.end.dateTime || event.end.date;

            return (
              <div key={event.id} className="gc-event-card">
                <div className="gc-event-title">{event.summary || "Untitled Event"}</div>
                <div className="gc-event-time">
                  <span>🕒 {start}</span> → <span>{end}</span>
                </div>
                {event.location && (
                  <div className="gc-event-location">📍 {event.location}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
