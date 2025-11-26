import { useTimeline } from "../../context/TimelineContext";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { useState, useEffect } from "react";

export const TeamActivity = () => {
  const { allEntries } = useTimeline();
  const { token } = useAuth();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!token) return;
      try {
        const users = await authApi.getAllUsers(token);
        setTeamMembers(users || []);
      } catch (error: any) {
        console.warn("Team members endpoint not available:", error.response?.status === 404 ? "Endpoint not found" : error.message);
        setTeamMembers([]);
      }
    };
    fetchTeamMembers();
  }, [token]);

  const totalTeamEntries = allEntries.length;
  
  const contributors = new Set<string>();
  
  allEntries.forEach(entry => {
    teamMembers.forEach(member => {
      if (entry.userId === member.id || 
          entry.User === member.email ||
          entry.User === member.name ||
          entry.User === member.displayName) {
        contributors.add(member.name || member.displayName || member.email);
      }
    });
    
    try {
      const metadata = entry.Metadata ? JSON.parse(entry.Metadata || "{}") : 
                       entry.metadata ? JSON.parse(entry.metadata || "{}") : {};
      if (metadata.user || metadata.assignedBy) {
        contributors.add(metadata.user || metadata.assignedBy);
      }
    } catch {
      // Ignore
    }
  });
  
  const uniqueContributors = teamMembers.length > 0 
    ? Math.max(contributors.size, teamMembers.length)
    : Math.max(contributors.size, 1);

  const collaborationEvents = allEntries.filter(entry => {
    const category = (entry.Category || entry.category || "").toLowerCase();
    const title = (entry.Title || entry.title || "").toLowerCase();
    return category.includes("meeting") || 
           category.includes("collaboration") || 
           category.includes("team") ||
           title.includes("meeting") ||
           title.includes("collaboration");
  }).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">My Activity</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-700">My Total Entries</span>
          <span className="text-lg font-semibold text-gray-900">{totalTeamEntries}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-700">My Active Days</span>
          <span className="text-lg font-semibold text-gray-900">{uniqueContributors}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-700">My Collaborations</span>
          <span className="text-lg font-semibold text-gray-900">{collaborationEvents}</span>
        </div>
      </div>
    </div>
  );
};