import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Clock, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTimeline } from "../context/TimelineContext";
import { TimelineEntry } from "../types/TimelineEntry";
import { formatDate } from "../utils/formatDate";

export default function TimelineWorkspace() {
  const { entryId } = useParams<{ entryId?: string }>();
  const navigate = useNavigate();
  const { allEntries, editEntry, removeEntry } = useTimeline();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Find the current entry
  const currentEntry = useMemo(() => {
    if (entryId) {
      const id = parseInt(entryId);
      const entry = allEntries.find(e => (e.id || (e as any).Id) === id);
      if (entry) {
        const index = allEntries.findIndex(e => (e.id || (e as any).Id) === id);
        setCurrentIndex(index >= 0 ? index : 0);
        return entry;
      }
    }
    // If no entryId or entry not found, show first entry
    if (allEntries.length > 0) {
      setCurrentIndex(0);
      return allEntries[0];
    }
    return null;
  }, [entryId, allEntries]);

  // Get sorted entries for navigation
  const sortedEntries = useMemo(() => {
    return [...allEntries].sort((a, b) => {
      const dateA = new Date(a.EventDate || a.eventDate || a.CreatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.EventDate || b.eventDate || b.CreatedAt || b.createdAt || 0).getTime();
      return dateB - dateA; // Most recent first
    });
  }, [allEntries]);

  // Update current entry when sorted entries change
  useEffect(() => {
    if (currentEntry && sortedEntries.length > 0) {
      const index = sortedEntries.findIndex(e => {
        const entryId = currentEntry.id || (currentEntry as any).Id;
        const sortedId = e.id || (e as any).Id;
        return entryId === sortedId;
      });
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [currentEntry, sortedEntries]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevEntry = sortedEntries[currentIndex - 1];
      const prevId = prevEntry.id || (prevEntry as any).Id;
      navigate(`/workspace/${prevId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < sortedEntries.length - 1) {
      const nextEntry = sortedEntries[currentIndex + 1];
      const nextId = nextEntry.id || (nextEntry as any).Id;
      navigate(`/workspace/${nextId}`);
    }
  };

  const handleDelete = async () => {
    if (!currentEntry) return;
    const id = currentEntry.id || (currentEntry as any).Id;
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await removeEntry(id);
        // Navigate to previous entry or back to timeline
        if (sortedEntries.length > 1) {
          if (currentIndex > 0) {
            const prevEntry = sortedEntries[currentIndex - 1];
            const prevId = prevEntry.id || (prevEntry as any).Id;
            navigate(`/workspace/${prevId}`);
          } else {
            const nextEntry = sortedEntries[currentIndex + 1];
            const nextId = nextEntry.id || (nextEntry as any).Id;
            navigate(`/workspace/${nextId}`);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Timeline</span>
          </Link>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No entry found</p>
            <Link
              to="/"
              className="mt-4 inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
            >
              Go to Timeline
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = currentEntry.Title || currentEntry.title || "Untitled";
  const description = currentEntry.Description || currentEntry.description;
  const category = currentEntry.Category || currentEntry.category;
  const eventDate = currentEntry.EventDate || currentEntry.eventDate;
  const createdAt = currentEntry.CreatedAt || currentEntry.createdAt;
  const imageUrl = currentEntry.ImageUrl || currentEntry.imageUrl;
  const entryIdNum = currentEntry.id || (currentEntry as any).Id;

  // Get related entries (same category)
  const relatedEntries = useMemo(() => {
    if (!category) return [];
    return sortedEntries
      .filter(e => {
        const eId = e.id || (e as any).Id;
        const eCategory = e.Category || e.category;
        return eId !== entryIdNum && eCategory === category;
      })
      .slice(0, 3);
  }, [sortedEntries, category, entryIdNum]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Timeline</span>
        </Link>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          <div className="text-sm text-gray-600">
            Entry <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of{" "}
            <span className="font-semibold text-gray-900">{sortedEntries.length}</span>
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === sortedEntries.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Main Entry Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden mb-6">
          {/* Image Section */}
          {imageUrl && (
            <div className="w-full h-96 bg-gray-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  {category && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-semibold">
                      <Tag className="w-4 h-4" />
                      {category}
                    </span>
                  )}
                  {(eventDate || createdAt) && (
                    <span className="inline-flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(eventDate || createdAt || new Date())}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="text-base font-semibold text-gray-900">
                    {eventDate ? formatDate(eventDate) : createdAt ? formatDate(createdAt) : "Not set"}
                  </p>
                </div>
              </div>
              {createdAt && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(createdAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/workspace/${entryIdNum}/edit`)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Entry</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Entry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Entries */}
        {relatedEntries.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Entries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedEntries.map((entry) => {
                const eId = entry.id || (entry as any).Id;
                const eTitle = entry.Title || entry.title || "Untitled";
                const eImageUrl = entry.ImageUrl || entry.imageUrl;
                return (
                  <Link
                    key={eId}
                    to={`/workspace/${eId}`}
                    className="block bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 transition-all overflow-hidden group"
                  >
                    {eImageUrl && (
                      <div className="w-full h-32 bg-gray-100 overflow-hidden">
                        <img
                          src={eImageUrl}
                          alt={eTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-800">
                        {eTitle}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

