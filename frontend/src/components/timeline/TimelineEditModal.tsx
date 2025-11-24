import { useState, useEffect } from "react";
import { TimelineEntry } from "../../types/TimelineEntry";
import { useTimeline } from "../../context/TimelineContext";
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";

interface Props {
  entry: TimelineEntry;
  onClose: () => void;
}

export const TimelineEditModal = ({ entry, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description || "");
  const [category, setCategory] = useState(entry.category || "");
  const { editEntry } = useTimeline();
  const { token } = useAuth();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      await editEntry(entry.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
      });
      onClose();
    } catch (error: any) {
      console.error("Failed to update entry:", error);
      alert(`Failed to update entry: ${error.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Entry</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select Category (optional)</option>
            <option value="GitHub">GitHub</option>
            <option value="Meeting">Meeting</option>
            <option value="Standup">Standup</option>
            <option value="Sprint Review">Sprint Review</option>
            <option value="Slack">Slack</option>
            <option value="Code">Code</option>
            <option value="Personal">Personal</option>
            <option value="Travel">Travel</option>
            <option value="Music">Music</option>
            <option value="Collaboration">Collaboration</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};