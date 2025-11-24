import { useState, useEffect } from "react";
import { ArrowUpDown, Settings, Shield, CheckCircle2, Circle, Plus, User, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

interface Task {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: "in progress" | "completed" | "pending";
  completed: boolean;
  assignedBy?: string;
  assignedTo?: string;
  subTasks?: { id: string; title: string; completed: boolean }[];
}

export const AssignedTasks = () => {
  const { token } = useAuth();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string }>({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedAssigner, setSelectedAssigner] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("all"); // Filter by assignee

  // Load tasks from localStorage on mount
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("assignedTasks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert stored tasks back to include icons
          return parsed.map((t: any) => ({
            ...t,
            icon: <Circle className="w-4 h-4" />,
          }));
        } catch (e) {
          console.error("Failed to parse stored tasks:", e);
        }
      }
    }
    // Default tasks
    return [
      {
        id: "1",
        title: "Improve deploy script",
        icon: <ArrowUpDown className="w-4 h-4" />,
        status: "in progress" as const,
        completed: false,
        assignedBy: "Team Member 1",
        assignedTo: "You",
      },
      {
        id: "2",
        title: "Redesign homepage",
        icon: <Settings className="w-4 h-4" />,
        status: "completed" as const,
        completed: false,
        assignedBy: "Team Member 2",
        assignedTo: "You",
      },
      {
        id: "3",
        title: "Review security policy",
        icon: <Shield className="w-4 h-4" />,
        status: "pending" as const,
        completed: false,
        assignedBy: "Team Member 3",
        assignedTo: "You",
      },
    ];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Store tasks without React elements (icons)
      const tasksToStore = tasks.map(({ icon, ...task }) => task);
      localStorage.setItem("assignedTasks", JSON.stringify(tasksToStore));
      // Dispatch custom event to notify TeamMembers component
      window.dispatchEvent(new Event("tasksUpdated"));
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const allMembers: string[] = [];
      
      // Get manually added team members from localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("manualTeamMembers");
        if (stored) {
          try {
            const manualMembers = JSON.parse(stored);
            manualMembers.forEach((m: any) => {
              if (m.name && !allMembers.includes(m.name)) {
                allMembers.push(m.name);
              }
            });
          } catch (e) {
            console.error("Failed to parse manual team members:", e);
          }
        }
      }
      
      if (!token) {
        if (allMembers.length === 0) {
          allMembers.push("You");
        }
        setTeamMembers(allMembers);
        setSelectedAssigner(allMembers[0] || "You");
        setSelectedAssignee(allMembers[0] || "You");
        return;
      }

      try {
        const user = await authApi.getCurrentUser(token);
        setCurrentUser({ name: user.name, email: user.email });

        // Add current user if not already in list
        if (user.name && !allMembers.includes(user.name)) {
          allMembers.unshift(user.name); // Add current user at the beginning
        }

        // Get team members from API (actual signed-in users)
        const users = await authApi.getAllUsers(token);
        users.forEach((u: any) => {
          const memberName = u.name || u.displayName || u.email;
          if (memberName && !allMembers.includes(memberName)) {
            allMembers.push(memberName);
          }
        });
        
        if (allMembers.length === 0) {
          allMembers.push(user.name || "You");
        }
        
        setTeamMembers(allMembers);
        setSelectedAssigner(user.name || allMembers[0] || "You");
        setSelectedAssignee(user.name || allMembers[0] || "You");
      } catch (error: any) {
        console.warn("Team members endpoint not available:", error.response?.status === 404 ? "Endpoint not found" : error.message);
        if (allMembers.length === 0) {
          if (currentUser.name) {
            allMembers.push(currentUser.name);
          } else {
            allMembers.push("You");
          }
        }
        setTeamMembers(allMembers);
        setSelectedAssigner(allMembers[0] || "You");
        setSelectedAssignee(allMembers[0] || "You");
      }
    };

    fetchTeamMembers();
    
    // Listen for team member updates from TeamMembers component
    const handleTeamMembersUpdate = () => {
      fetchTeamMembers();
    };
    
    window.addEventListener("teamMembersUpdated", handleTeamMembersUpdate);
    
    return () => {
      window.removeEventListener("teamMembersUpdated", handleTeamMembersUpdate);
    };
  }, [token]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        let newStatus = task.status;
        if (newCompleted && task.status !== "completed") {
          newStatus = "completed";
        } else if (!newCompleted && task.status === "completed") {
          newStatus = "in progress";
        }
        return { ...task, completed: newCompleted, status: newStatus };
      }
      return task;
    }));
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.subTasks) {
        const updatedSubTasks = task.subTasks.map(st => 
          st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        const allSubTasksCompleted = updatedSubTasks.every(st => st.completed);
        return {
          ...task,
          subTasks: updatedSubTasks,
          completed: allSubTasksCompleted,
          status: allSubTasksCompleted ? "completed" : task.status === "completed" ? "in progress" : task.status,
        };
      }
      return task;
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const assignerName = selectedAssigner === "You" 
      ? (currentUser.name || "You")
      : selectedAssigner.trim();
    
    const assigneeName = selectedAssignee === "You"
      ? (currentUser.name || "You")
      : selectedAssignee.trim();
    
    if (!assignerName || !assigneeName) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      icon: <Circle className="w-4 h-4" />,
      status: "pending",
      completed: false,
      assignedBy: assignerName,
      assignedTo: assigneeName,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setSelectedAssignee(currentUser.name || "You"); // Reset to current user
    setShowAddTask(false);
  };

  const deleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      setOpenMenuId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Assigned Tasks</h3>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Add new task"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showAddTask && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            autoFocus
          />
          <label className="block text-xs text-gray-600 mb-1">Assigned by:</label>
          <select
            value={selectedAssigner}
            onChange={(e) => setSelectedAssigner(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
          >
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          <label className="block text-xs text-gray-600 mb-1 mt-2">Assign to:</label>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
          >
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <button
              onClick={addTask}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setShowAddTask(false);
                setNewTaskTitle("");
              }}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter by Assignee */}
      {teamMembers.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-1">Filter by assignee:</label>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Tasks</option>
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        {tasks
          .filter(task => {
            if (filterAssignee === "all") return true;
            const assigneeName = task.assignedTo === "You" ? (currentUser.name || "You") : task.assignedTo;
            return assigneeName === filterAssignee;
          })
          .map((task) => (
            <div key={task.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1 text-gray-600">
                {task.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.assignedBy && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            By {task.assignedBy}
                          </span>
                        )}
                        {task.assignedTo && task.assignedTo !== "You" && (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            To {task.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenuId === task.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {task.subTasks && task.subTasks.length > 0 && (
                  <div className="mt-3 ml-7 space-y-2">
                    {task.subTasks.map((subTask) => (
                      <div key={subTask.id} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSubTask(task.id, subTask.id)}
                          className="flex-shrink-0"
                        >
                          {subTask.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                        <p className={`text-xs text-gray-600 ${subTask.completed ? "line-through" : ""}`}>
                          {subTask.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          ))}
      </div>
    </div>
  );
};