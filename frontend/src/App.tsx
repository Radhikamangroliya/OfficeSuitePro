import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TimelineProvider } from "./context/TimelineContext";

import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import TimelineWorkspace from "./pages/TimelineWorkspace";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <AuthProvider>
      <TimelineProvider>
        <Router>
          <Routes>

            <Route path="/oauth-callback" element={<OAuthCallback />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Protected><Timeline /></Protected>} />

            <Route path="/workspace/:entryId?" element={<Protected><TimelineWorkspace /></Protected>} />

            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

            <Route path="/profile" element={<Protected><Profile /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </TimelineProvider>
    </AuthProvider>
  );
}

function Protected({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? (
    <>
      <Navigation />
      {children}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}
