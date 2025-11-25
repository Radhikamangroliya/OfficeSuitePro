import { createContext, useContext, useState, useEffect } from "react";
import { TimelineEntry } from "../types/TimelineEntry";
import { getTimelineEntries, createTimelineEntry, updateTimelineEntry, deleteTimelineEntry } from "../api/timelineApi";
import { useAuth } from "./AuthContext";

interface TimelineContextType {
  entries: TimelineEntry[];
  allEntries: TimelineEntry[]; // Unfiltered entries for stats
  loading: boolean;
  createEntry: (e: any, token?: string) => Promise<void>;
  editEntry: (id: number, updates: Partial<TimelineEntry>) => Promise<void>;
  removeEntry: (id: number) => Promise<void>;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
}

const TimelineContext = createContext<TimelineContextType | null>(null);

export const TimelineProvider = ({ children }: any) => {
  const { token } = useAuth();

  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (token) loadEntries();
  }, [token]);

  const loadEntries = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log("Loading timeline entries...");
      const data = await getTimelineEntries(token);
      console.log("Timeline entries loaded:", data);
      console.log("Number of entries:", Array.isArray(data) ? data.length : 0);
      if (Array.isArray(data) && data.length > 0) {
        console.log("First entry sample:", data[0]);
        console.log("First entry keys:", Object.keys(data[0]));
      } else {
        console.warn("⚠️ No entries returned. Check backend logs for UserId mismatch.");
      }
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed loading entries", err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: any, providedToken?: string) => {
    // Use provided token, or context token, or localStorage token as fallback
    const currentToken = providedToken || token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    
    if (!currentToken) {
      console.error("No token available for creating entry");
      throw new Error("You must be logged in to create an entry");
    }
    
    try {
      await createTimelineEntry(entryData, currentToken);
      await loadEntries();
    } catch (err) {
      console.error("Failed to create entry", err);
      throw err;
    }
  };
  
  const editEntry = async (id: number, updates: Partial<TimelineEntry>) => {
    if (!token) return;
    try {
      await updateTimelineEntry(id, updates, token);
      await loadEntries();
    } catch (err) {
      console.error("Failed to update entry", err);
      throw err;
    }
  };

  const removeEntry = async (id: number) => {
    if (!token) return;
    try {
      await deleteTimelineEntry(id, token);
      await loadEntries();
    } catch (err) {
      console.error("Failed to delete entry", err);
      throw err;
    }
  };

  const filteredEntries = entries.filter((e) => {
    // Handle both PascalCase and camelCase property names
    const title = e.title || e.title || "";
    const description = e.description || e.description || "";
    const entryCategory = e.category || e.category || "";

    const matchSearch =
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category ? entryCategory === category : true;

    return matchSearch && matchCategory;
  });

  return (
    <TimelineContext.Provider
      value={{
        entries: filteredEntries,
        allEntries: entries, // Provide unfiltered entries for stats
        loading,
        createEntry,
        editEntry,
        removeEntry,
        setSearch,
        setCategory,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => useContext(TimelineContext)!;