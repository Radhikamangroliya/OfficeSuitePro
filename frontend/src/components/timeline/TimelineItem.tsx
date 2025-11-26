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
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

interface TimelineItemProps {
  item: TimelineEntry;
  onEdit?: (item: TimelineEntry) => void;
  onDelete?: (id: number) => void;
}

export const TimelineItem = ({ item, onEdit, onDelete }: TimelineItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const getCategoryIcon = (category?: string) => {
    const iconClass = "w-5 h-5";
    const categoryLower = category?.toLowerCase() || "";

    if (categoryLower.includes("github") || categoryLower.includes("push")) {
      return <Github className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("slack") || categoryLower.includes("message")) {
      return <MessageSquare className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("meeting") || categoryLower.includes("standup")) {
      return <Users className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("sprint") || categoryLower.includes("review")) {
      return <Zap className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("help") || categoryLower.includes("collaboration")) {
      return <Users className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("spotify") || categoryLower.includes("music")) {
      return <Music2 className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("travel")) {
      return <Plane className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("personal") || categoryLower.includes("memory")) {
      return <Star className={`${iconClass} text-gray-800`} />;
    }
    if (categoryLower.includes("code") || categoryLower.includes("coding")) {
      return <Code className={`${iconClass} text-gray-800`} />;
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

  const handleItemClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the menu button or menu items
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menu"]')) {
      return;
    }
    navigate(`/workspace/${entryId}`);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleItemClick}
    >
      {/* Accent Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
      
      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Enhanced Icon Container */}
          <div className="flex-shrink-0 relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              {getCategoryIcon(category)}
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {title}
                  </h3>
                  {category && (
                    <span className="inline-flex items-center text-xs font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 rounded-full border border-gray-200">
                      {category}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {description}
                  </p>
                )}
                
                {/* Enhanced Metadata */}
                <div className="flex items-center gap-4 flex-wrap">
                  {(eventDate || createdAt) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">
                        {formatDate(eventDate || createdAt || new Date())}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Actions Menu */}
              {(onEdit || onDelete) && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 border border-gray-200 hover:border-gray-300"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[140px]">
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(item);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
          </div>
        </div>

        {/* Enhanced Thumbnail Image */}
        {imageUrl && (
          <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 shadow-md group-hover:shadow-lg transition-shadow">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-cover max-h-80 group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};