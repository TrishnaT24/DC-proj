
import React, { useState, useEffect } from "react";
import TaskModalForm from "./TaskFormModal";
import { useAuth } from "./AuthContext";
import { fetchTasks, createTask, updateTaskStatus } from "./api";

const statusOptions = ["Not Started", "In Progress", "Completed", "Blocked"];

export default function DashboardApp() {
  const { user, logout, isLeader } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" or a specific username
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    deadline: new Date().toISOString().split("T")[0],
    status: "Not Started",
  });

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        
        // Extract unique members from tasks
        const uniqueMembers = [...new Set(fetchedTasks.map(task => task.assignedTo))];
        setMembers(uniqueMembers);
        
        // Set initial filter to "all"
        filterTasks("all", fetchedTasks);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);
  
  // Filter tasks based on selected user
  const filterTasks = (filter, tasksList = tasks) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredTasks(tasksList);
    } else {
      setFilteredTasks(tasksList.filter(task => task.assignedTo === filter));
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId, title, newStatus) => {
    try {
      if (user.role !== "member") {
        setError("Only members can update task status");
        return;
      }

      const updatedData = {
        title,
        status: newStatus,
        username: user.username
      };

      await updateTaskStatus(updatedData);
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      
      setTasks(updatedTasks);
      filterTasks(activeFilter, updatedTasks);
    } catch (err) {
      setError(err.message || "Failed to update task status");
    }
  };

  // Handle task creation
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      if (!isLeader) {
        setError("Only leaders can create tasks");
        return;
      }

      const taskData = {
        title: newTask.title,
        assignedTo: newTask.assignedTo,
        deadline: newTask.deadline,
        username: user.username // createdBy field
      };

      const result = await createTask(taskData);
      
      // Add new task to state
      const updatedTasks = [...tasks, result.task];
      setTasks(updatedTasks);
      filterTasks(activeFilter, updatedTasks);
      
      // Update members list if needed
      if (!members.includes(result.task.assignedTo)) {
        setMembers([...members, result.task.assignedTo]);
      }
      
      // Reset form and close modal
      setShowForm(false);
      setNewTask({
        title: "",
        assignedTo: members[0] || "",
        deadline: new Date().toISOString().split("T")[0],
        status: "Not Started",
      });
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-600">
          Task Dashboard - {user?.role === "leader" ? "Leader" : "Member"}: {user?.username}
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-screen-lg mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              className="float-right font-bold" 
              onClick={() => setError("")}
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => filterTasks("all")}
            className={`px-4 py-2 rounded ${
              activeFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            All Tasks
          </button>
          
          {members.map((member) => (
            <button
              key={member}
              onClick={() => filterTasks(member)}
              className={`px-4 py-2 rounded ${
                activeFilter === member
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {member}
            </button>
          ))}
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 border-b font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-3">Task Title</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.assignedTo}</td>
                    <td className="px-4 py-3">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{task.createdBy}</td>
                    <td className="px-4 py-3">
                      {user.username === task.assignedTo && user.role === "member" ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task._id,
                              task.title,
                              e.target.value
                            )
                          }
                          className={`border rounded px-2 py-1 text-sm font-medium ${
                            task.status === "Completed"
                              ? "text-green-500"
                              : task.status === "Blocked"
                                ? "text-red-500"
                                : task.status === "In Progress"
                                  ? "text-blue-500"
                                  : "text-gray-700"
                          }`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-sm font-medium ${
                            task.status === "Completed"
                              ? "text-green-500"
                              : task.status === "Blocked"
                                ? "text-red-500"
                                : task.status === "In Progress"
                                  ? "text-blue-500"
                                  : "text-gray-700"
                          }`}
                        >
                          {task.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating + Button (only for leaders) */}
      {isLeader && (
        <button
          onClick={() => {
            // Initialize with first member as default assignee if available
            setNewTask(prev => ({
              ...prev,
              assignedTo: members.length > 0 ? members[0] : ""
            }));
            setShowForm(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          +
        </button>
      )}

      {/* Modal Form */}
      {showForm && (
        <TaskModalForm
          members={members}
          statusOptions={statusOptions}
          newTask={newTask}
          setNewTask={setNewTask}
          setShowForm={setShowForm}
          handleAddTask={handleAddTask}
        />
      )}
    </div>
  );
}