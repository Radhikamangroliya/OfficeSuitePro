import { useState } from "react";
import { useTimeline } from "../../context/TimelineContext";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

export const TimelineCreateModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createEntry } = useTimeline();
  const { token } = useAuth();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check token from localStorage as fallback
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    
    if (!currentToken) {
      alert("You must be logged in to create an entry. Please log in first.");
      console.error("No token found. Token from context:", token, "Token from localStorage:", typeof window !== "undefined" ? localStorage.getItem("token") : "N/A");
      return;
    }

    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const title = (formData.get("title") as string)?.trim();
      const description = (formData.get("description") as string)?.trim();
      const category = (formData.get("category") as string)?.trim();
      const imageUrl = (formData.get("imageUrl") as string)?.trim();
      const externalId = (formData.get("externalId") as string)?.trim();
      const externalUrl = (formData.get("externalUrl") as string)?.trim();
      const metadata = (formData.get("metadata") as string)?.trim();

      if (!title) {
        alert("Title is required");
        setLoading(false);
        return;
      }

      // Get current user email
      let userEmail = "";
      try {
        const user = await authApi.getCurrentUser(currentToken);
        userEmail = user.email || "";
      } catch (err) {
        console.error("Failed to get user email:", err);
        // Continue with default email if user fetch fails
      }

      // Create entry data with PascalCase property names (matching backend)
      const entryData = {
        User: userEmail || "someone@example.com",
        Metadata: metadata || JSON.stringify({ source: "manual-entry" }),
        ExternalId: externalId || crypto.randomUUID(),
        ExternalUrl: externalUrl || "https://placeholder.url",
        Title: title,
        Description: description || "",
        Category: category || "",
        EventDate: new Date().toISOString(),
        EntryType: "Activity",
        ImageUrl: imageUrl || "",
      };

      console.log("Creating entry with data:", entryData);
      console.log("Using token:", currentToken ? "Token exists" : "No token");
      
      // Pass token explicitly to createEntry
      await createEntry(entryData, currentToken);
      console.log("Entry created successfully");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to create entry:", error);
      alert(`Failed to create entry: ${error.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>+</span>
        <span>Add Entry</span>
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={handleCreate}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">Add to My Timeline</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div>
              <input 
                name="title" 
                placeholder="Title" 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <textarea 
                name="description" 
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <select 
                name="category" 
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input 
                type="url" 
                name="imageUrl" 
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External ID (optional)
              </label>
              <input 
                type="text" 
                name="externalId" 
                placeholder="Enter external ID or leave empty for auto-generated UUID"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External URL (optional)
              </label>
              <input 
                type="url" 
                name="externalUrl" 
                placeholder="https://placeholder.url"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metadata (optional)
              </label>
              <textarea 
                name="metadata" 
                placeholder='{"source":"manual-entry"} or any JSON string'
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Enter JSON string or leave empty for default metadata
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-sm hover:shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};