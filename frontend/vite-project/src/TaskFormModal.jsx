
import React, { useState, useEffect } from "react";

export default function TaskFormModal({
  newTask,
  setNewTask,
  statusOptions,
  handleAddTask,
  setShowForm,
}) {
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/users');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Validate form before submission
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }
    
    if (!newTask.assignedTo && users.length > 0) {
      errors.assignedTo = "Please assign this task to someone";
      isValid = false;
    }
    
    if (!newTask.dueDate) {
      errors.dueDate = "Due date is required";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle form submission with validation
  const submitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddTask(e);
    }
  };
  
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setShowForm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <form onSubmit={submitForm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Task Title:</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Assign To:</label>
              {isLoading ? (
                <div className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-50 text-gray-500">
                  Loading users...
                </div>
              ) : error ? (
                <div className="w-full border border-red-200 px-3 py-2 rounded bg-red-50 text-red-500">
                  Failed to load users: {error}
                </div>
              ) : users.length > 0 ? (
                <div>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignedTo: e.target.value })
                    }
                    className={`w-full border px-3 py-2 rounded ${
                      formErrors.assignedTo ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.username} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  {formErrors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.assignedTo}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No users available</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Status:</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Due Date:</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  formErrors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}