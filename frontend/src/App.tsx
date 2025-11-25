import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TimelineProvider } from "./context/TimelineContext";

import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import OAuthCallback from "./pages/OAuthCallback";

export default function App() {
  return (
    <AuthProvider>
      <TimelineProvider>
        <Router>
          <Routes>

            <Route path="/oauth-callback" element={<OAuthCallback />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Protected><Timeline /></Protected>} />

            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

            <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </TimelineProvider>
    </AuthProvider>
  );
}

function Protected({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}
