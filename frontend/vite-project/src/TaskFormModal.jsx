import React from "react";

export default function TaskFormModal({
  newTask,
  setNewTask,
  people,
  statusOptions,
  handleAddTask,
  setShowForm,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleAddTask}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Assign To:</label>
            <select
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              {people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Task Name:</label>
            <input
              type="text"
              value={newTask.taskName}
              onChange={(e) =>
                setNewTask({ ...newTask, taskName: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* <div>
            <label className="block mb-1 font-medium">Assigned By:</label>
            <input
              type="text"
              value={newTask.assignedBy}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedBy: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div> */}

          <div>
            <label className="block mb-1 font-medium">Set Deadline:</label>
            <input
              type="date"
              value={newTask.assignedOn}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedOn: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status:</label>
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
