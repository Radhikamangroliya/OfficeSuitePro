import { useState, useEffect } from "react";
import { User, Plus, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { useTimeline } from "../../context/TimelineContext";

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  tasksAssigned: number;
  tasksCompleted: number;
  lastActive?: string;
}

export const TeamMembers = () => {
  const { token } = useAuth();
  const { allEntries } = useTimeline();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string }>({});
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    if (token) {
      authApi.getCurrentUser(token).then(user => {
        setCurrentUser({ name: user.name, email: user.email });
      }).catch(() => {});
    }
  }, [token]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // Force refresh trigger

  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Get manually added team members from localStorage
      let manualMembers: any[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("manualTeamMembers");
        if (stored) {
          try {
            manualMembers = JSON.parse(stored);
          } catch (e) {
            console.error("Failed to parse manual team members:", e);
          }
        }
      }
      
      if (!token) {
        // If no token, show only manually added members
        const members: TeamMember[] = manualMembers.map((m: any, index: number) => {
          // Get tasks from localStorage
          let assignedTasks: any[] = [];
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("assignedTasks");
            if (stored) {
              try {
                assignedTasks = JSON.parse(stored);
              } catch (e) {
                console.error("Failed to parse stored tasks:", e);
              }
            }
          }
          
          const tasksAssignedToUser = assignedTasks.filter((task: any) => 
            task.assignedTo === m.name
          );
          
          const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
            task.status === "completed" || task.completed === true
          ).length;
          
          return {
            id: `manual-${index}`,
            name: m.name,
            email: m.email,
            tasksAssigned: tasksAssignedToUser.length,
            tasksCompleted: tasksCompleted,
            lastActive: "Just added",
          };
        });
        
        setTeamMembers(members);
        return;
      }

      try {
        const users = await authApi.getAllUsers(token);
        
        // Get tasks from localStorage (shared with AssignedTasks)
        let assignedTasks: any[] = [];
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("assignedTasks");
          if (stored) {
            try {
              assignedTasks = JSON.parse(stored);
            } catch (e) {
              console.error("Failed to parse stored tasks:", e);
            }
          }
        }
        
        // Create a map to track which users we've already added
        const memberMap = new Map<string, TeamMember>();
        
        // First, add API users (signed-in users)
        users.forEach((user: any) => {
          const isCurrentUser = user.email === currentUser.email;
          const userName = user.name || user.displayName || user.email;
          
          // Count tasks assigned TO this user
          const tasksAssignedToUser = assignedTasks.filter((task: any) => 
            task.assignedTo === userName || 
            (task.assignedTo === "You" && isCurrentUser)
          );
          
          // Count completed tasks
          const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
            task.status === "completed" || task.completed === true
          ).length;
          
          // Also count timeline entries
          const userEntries = allEntries.filter(entry => {
            if (entry.userId === user.id) return true;
            if (entry.User === user.email || entry.User === user.name || entry.User === user.displayName) return true;
            try {
              const metadata = entry.Metadata ? JSON.parse(entry.Metadata || "{}") : 
                               entry.metadata ? JSON.parse(entry.metadata || "{}") : {};
              return metadata.user === user.email || 
                     metadata.user === user.name ||
                     metadata.assignedBy === user.name ||
                     metadata.assignedBy === user.email;
            } catch {
              return false;
            }
          });

          const lastActive = user.lastLoginAt 
            ? new Date(user.lastLoginAt).toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric" 
              })
            : "Unknown";

          memberMap.set(userName, {
            id: user.id.toString(),
            name: userName,
            email: user.email,
            role: isCurrentUser ? "You" : undefined,
            tasksAssigned: tasksAssignedToUser.length,
            tasksCompleted: tasksCompleted,
            lastActive: isCurrentUser ? "Active now" : lastActive,
          });
        });
        
        // Then, add manually added members (if not already in the list)
        manualMembers.forEach((m: any, index: number) => {
          if (!m.name) return;
          
          // Check if this member already exists (from API)
          if (memberMap.has(m.name)) {
            // Update existing member if needed
            const existing = memberMap.get(m.name)!;
            // Recalculate tasks for manually added members
            const tasksAssignedToUser = assignedTasks.filter((task: any) => 
              task.assignedTo === m.name || 
              (task.assignedTo === "You" && existing.role === "You")
            );
            const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
              task.status === "completed" || task.completed === true
            ).length;
            existing.tasksAssigned = tasksAssignedToUser.length;
            existing.tasksCompleted = tasksCompleted;
          } else {
            // Add new manually added member
            const tasksAssignedToUser = assignedTasks.filter((task: any) => 
              task.assignedTo === m.name
            );
            const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
              task.status === "completed" || task.completed === true
            ).length;
            
            memberMap.set(m.name, {
              id: `manual-${Date.now()}-${index}`,
              name: m.name,
              email: m.email,
              tasksAssigned: tasksAssignedToUser.length,
              tasksCompleted: tasksCompleted,
              lastActive: "Just added",
            });
          }
        });

        setTeamMembers(Array.from(memberMap.values()));
      } catch (error: any) {
        console.warn("Team members endpoint not available:", error.response?.status === 404 ? "Endpoint not found" : error.message);
        
        // If API fails, still show manual members and current user
        const fallbackMembers: TeamMember[] = [];
        
        // Add current user if available
        if (currentUser.name) {
          let assignedTasks: any[] = [];
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("assignedTasks");
            if (stored) {
              try {
                assignedTasks = JSON.parse(stored);
              } catch (e) {
                console.error("Failed to parse stored tasks:", e);
              }
            }
          }
          
          const tasksAssignedToUser = assignedTasks.filter((task: any) => 
            task.assignedTo === currentUser.name || task.assignedTo === "You"
          );
          const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
            task.status === "completed" || task.completed === true
          ).length;
          
          fallbackMembers.push({
            id: "current-user",
            name: currentUser.name,
            email: currentUser.email,
            role: "You",
            tasksAssigned: tasksAssignedToUser.length,
            tasksCompleted: tasksCompleted,
            lastActive: "Active now",
          });
        }
        
        // Add manual members
        manualMembers.forEach((m: any, index: number) => {
          if (!m.name) return;
          
          let assignedTasks: any[] = [];
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("assignedTasks");
            if (stored) {
              try {
                assignedTasks = JSON.parse(stored);
              } catch (e) {
                console.error("Failed to parse stored tasks:", e);
              }
            }
          }
          
          const tasksAssignedToUser = assignedTasks.filter((task: any) => 
            task.assignedTo === m.name
          );
          const tasksCompleted = tasksAssignedToUser.filter((task: any) => 
            task.status === "completed" || task.completed === true
          ).length;
          
          fallbackMembers.push({
            id: `manual-${index}`,
            name: m.name,
            email: m.email,
            tasksAssigned: tasksAssignedToUser.length,
            tasksCompleted: tasksCompleted,
            lastActive: "Just added",
          });
        });
        
        setTeamMembers(fallbackMembers);
      }
    };

    // Always fetch team members, even if no token (to show manual members)
    fetchTeamMembers();
    
    // Also refresh when localStorage changes (when tasks are added/updated)
    const handleStorageChange = () => {
      console.log("TeamMembers: Storage change detected, refreshing...");
      fetchTeamMembers();
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom events for same-tab updates
    window.addEventListener("tasksUpdated", handleStorageChange);
    window.addEventListener("teamMembersUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tasksUpdated", handleStorageChange);
      window.removeEventListener("teamMembersUpdated", handleStorageChange);
    };
  }, [token, currentUser, allEntries, refreshKey]);

  const addTeamMember = () => {
    if (!newMemberName.trim()) return;

    // Get existing manual members from localStorage
    let existingManualMembers: any[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("manualTeamMembers");
      if (stored) {
        try {
          existingManualMembers = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse manual team members:", e);
        }
      }
    }

    // Check if member already exists
    const memberName = newMemberName.trim();
    const memberEmail = newMemberEmail.trim() || undefined;
    
    if (existingManualMembers.some((m: any) => m.name === memberName)) {
      alert("A team member with this name already exists!");
      return;
    }

    // Add new member to the list
    const newManualMember = {
      name: memberName,
      email: memberEmail,
    };

    const updatedManualMembers = [...existingManualMembers, newManualMember];
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("manualTeamMembers", JSON.stringify(updatedManualMembers));
      console.log("TeamMembers: Saved manual members to localStorage:", updatedManualMembers);
      // Notify components to refresh
      window.dispatchEvent(new Event("teamMembersUpdated"));
    }
    
    // Clear form
    setNewMemberName("");
    setNewMemberEmail("");
    setShowAddMember(false);
    
    // Force refresh by updating refreshKey
    setRefreshKey(prev => prev + 1);
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString || dateString === "Active now" || dateString === "Just added") {
      return dateString || "Unknown";
    }
    return dateString;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Add team member"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showAddMember && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Member name..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onKeyPress={(e) => e.key === "Enter" && addTeamMember()}
            autoFocus
          />
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Email (optional)..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onKeyPress={(e) => e.key === "Enter" && addTeamMember()}
          />
          <div className="flex gap-2">
            <button
              onClick={addTeamMember}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Member
            </button>
            <button
              onClick={() => {
                setShowAddMember(false);
                setNewMemberName("");
                setNewMemberEmail("");
              }}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {teamMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No team members yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add team members to collaborate
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  {member.role && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {member.role}
                    </span>
                  )}
                </div>
                {member.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">
                      {member.tasksCompleted} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(member.lastActive)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {teamMembers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total members</span>
            <span className="font-semibold text-gray-900">{teamMembers.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};