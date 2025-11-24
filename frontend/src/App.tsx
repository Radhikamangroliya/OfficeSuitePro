import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TimelineProvider } from "./context/TimelineContext";

import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  return (
    <AuthProvider>
      <TimelineProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard page */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Google Calendar page */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />

            {/* Home - Timeline page */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TimelineProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
