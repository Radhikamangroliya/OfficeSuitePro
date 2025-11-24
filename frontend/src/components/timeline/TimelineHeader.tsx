import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const TimelineHeader = () => {
  const { logout } = useAuth();

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Dashboard", href: "#" },
    { label: "Reports", href: "#" },
    { label: "Settings", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              WorkLife Intelligence
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => e.preventDefault()}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};