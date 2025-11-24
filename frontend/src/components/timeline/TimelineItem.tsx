import {
  Calendar,
  Github,
  Music2,
  Plane,
  Star,
  MessageSquare,
  Users,
  Code,
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { TimelineEntry } from "../../types/TimelineEntry";
import { useState } from "react";
import { formatDate } from "../../utils/formatDate";

interface TimelineItemProps {
  item: TimelineEntry;
  onEdit?: (item: TimelineEntry) => void;
  onDelete?: (id: number) => void;
}

export const TimelineItem = ({ item, onEdit, onDelete }: TimelineItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const getCategoryIcon = (category?: string) => {
    const iconClass = "w-5 h-5";
    const categoryLower = category?.toLowerCase() || "";

    if (categoryLower.includes("github") || categoryLower.includes("push")) {
      return <Github className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("slack") || categoryLower.includes("message")) {
      return <MessageSquare className={`${iconClass} text-purple-600`} />;
    }
    if (categoryLower.includes("meeting") || categoryLower.includes("standup")) {
      return <Users className={`${iconClass} text-blue-600`} />;
    }
    if (categoryLower.includes("sprint") || categoryLower.includes("review")) {
      return <Zap className={`${iconClass} text-yellow-600`} />;
    }
    if (categoryLower.includes("help") || categoryLower.includes("collaboration")) {
      return <Users className={`${iconClass} text-green-600`} />;
    }
    if (categoryLower.includes("spotify") || categoryLower.includes("music")) {
      return <Music2 className={`${iconClass} text-green-600`} />;
    }
    if (categoryLower.includes("travel")) {
      return <Plane className={`${iconClass} text-blue-600`} />;
    }
    if (categoryLower.includes("personal") || categoryLower.includes("memory")) {
      return <Star className={`${iconClass} text-yellow-500`} />;
    }
    if (categoryLower.includes("code") || categoryLower.includes("coding")) {
      return <Code className={`${iconClass} text-indigo-600`} />;
    }

    return <Calendar className={`${iconClass} text-gray-600`} />;
  };

  if (!item) return null;

  // Handle both PascalCase and camelCase property names
  const title = item.Title || item.title || "";
  const description = item.Description || item.description;
  const category = item.Category || item.category;
  const imageUrl = item.ImageUrl || item.imageUrl;
  const eventDate = item.EventDate || item.eventDate;
  const createdAt = item.CreatedAt || item.createdAt;
  const entryId = item.id || item.Id || 0;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete?.(entryId);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
            {getCategoryIcon(category)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Actions Menu */}
              {(onEdit || onDelete) && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(item);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {category && (
                <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                  {category}
                </span>
              )}
              {(eventDate || createdAt) && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(eventDate || createdAt || new Date())}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Image */}
        {imageUrl && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-cover max-h-64"
            />
          </div>
        )}
      </div>
    </div>
  );
};