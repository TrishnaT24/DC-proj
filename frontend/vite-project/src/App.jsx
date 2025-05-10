import React, { useState } from "react";
import TaskModalForm from "./TaskFormModal";

const people = ["Alice", "Bob", "Charlie", "David", "Eva"];

const initialTasks = {
  Alice: [
    {
      id: 1,
      assignedTask: "UI Design",
      assignedOn: "2025-05-01",
      assignedBy: "Manager A",
      taskName: "Login Page",
      status: "In Progress",
    },
  ],
  Bob: [],
  Charlie: [],
  David: [],
  Eva: [],
};

const statusOptions = ["Not Started", "In Progress", "Completed", "Blocked"];

export default function DashboardApp() {
  const [selectedPerson, setSelectedPerson] = useState("Alice");
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);

  const [newTask, setNewTask] = useState({
    assignedTo: "Alice",
    taskName: "",
    assignedTask: "",
    assignedBy: "",
    assignedOn: new Date().toISOString().split("T")[0],
    status: "Not Started",
  });

  const handleStatusChange = (person, taskId, newStatus) => {
    const updatedTasks = tasks[person].map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks({ ...tasks, [person]: updatedTasks });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const updatedList = [
      ...tasks[newTask.assignedTo],
      {
        id: Date.now(),
        assignedTask: newTask.assignedTask,
        assignedOn: newTask.assignedOn,
        assignedBy: newTask.assignedBy,
        taskName: newTask.taskName,
        status: newTask.status,
      },
    ];
    setTasks({ ...tasks, [newTask.assignedTo]: updatedList });
    setShowForm(false);
    setNewTask({
      assignedTo: selectedPerson,
      taskName: "",
      assignedTask: "",
      assignedBy: "",
      assignedOn: new Date().toISOString().split("T")[0],
      status: "Not Started",
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="w-full bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-600">Task Dashboard</div>
        <button
          onClick={() => alert("Logged out!")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-screen-lg mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {people.map((person) => (
            <button
              key={person}
              onClick={() => setSelectedPerson(person)}
              className={`px-4 py-2 rounded ${selectedPerson === person
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
                }`}
            >
              {person}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 border-b font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-3">Assigned Task</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Assigned By</th>
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks[selectedPerson].length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No tasks assigned.
                  </td>
                </tr>
              ) : (
                tasks[selectedPerson].map((task) => (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{task.assignedTask}</td>
                    <td className="px-4 py-3">{task.assignedOn}</td>
                    <td className="px-4 py-3">{task.assignedBy}</td>
                    <td className="px-4 py-3">{task.taskName}</td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedPerson,
                            task.id,
                            e.target.value
                          )
                        }
                        className={`border rounded px-2 py-1 text-sm font-medium ${task.status === "Completed"
                          ? "text-green-500"
                          : task.status === "Blocked"
                            ? "text-red-500"
                            : "text-gray-700"
                          }`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700"
      >
        +
      </button>

      {/* Modal Form */}
      {showForm && (
        <TaskModalForm
          people={people}
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
