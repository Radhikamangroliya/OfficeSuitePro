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
  // Handle both PascalCase and camelCase property names from entry
  const entryTitle = (entry as any).Title || entry.title || "";
  const entryDescription = (entry as any).Description || entry.description || "";
  const entryCategory = (entry as any).Category || entry.category || "";
  const entryImageUrl = (entry as any).ImageUrl || entry.imageUrl || "";
  
  const [title, setTitle] = useState(entryTitle);
  const [description, setDescription] = useState(entryDescription);
  const [category, setCategory] = useState(entryCategory);
  const [imageUrl, setImageUrl] = useState(entryImageUrl);
  
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
      // Build update data object with PascalCase properties (matching backend DTO)
      // Only include fields that have values (don't send undefined or empty strings for optional fields)
      const updateData: any = {
        Title: title.trim(), // Required field
      };
      
      // Add optional fields only if they have values
      if (description.trim()) {
        updateData.Description = description.trim();
      }
      if (category) {
        updateData.Category = category;
      }
      if (imageUrl.trim()) {
        updateData.ImageUrl = imageUrl.trim();
      }
      
      // Get entry ID (handle both naming conventions)
      const entryId = entry.id || (entry as any).Id;
      
      console.log("Updating entry with data:", updateData);
      await editEntry(entryId, updateData);
      onClose();
    } catch (error: any) {
      console.error("Failed to update entry:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to update entry: ${error.response?.data?.error || error.response?.data?.details || error.message || "Please try again"}`);
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
          <h2 className="text-2xl font-semibold text-gray-900">Edit My Entry</h2>
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all bg-white"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};