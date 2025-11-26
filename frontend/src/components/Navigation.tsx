import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Clock, LogOut, Github, FolderKanban, User } from "lucide-react";

export default function Navigation() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/workspace") {
      return location.pathname === path || location.pathname.startsWith("/workspace/");
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Timeline", icon: Clock },
    { path: "/workspace", label: "Workspace", icon: FolderKanban },
    { path: "/dashboard", label: "Dashboard", icon: Github },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-gray-800" />
            <span className="text-xl font-bold text-gray-900">My OS</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(item.path)
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

