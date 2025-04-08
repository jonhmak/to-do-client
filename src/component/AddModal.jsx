import { useState } from "react";

export default function AddModal({ hide, onAddTask }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [error, setError] = useState("");

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validTasks = tasks.filter((task) => task.trim() !== "");

    if (!title.trim() || validTasks.length === 0) {
      setError("Title and at least one task description are required.");
      return;
    }

    setError("");

    const taskData = { title, tasks: validTasks };

    try {
      const response = await fetch("http://localhost:3000/add-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok) {
        onAddTask(); // 🔥 Trigger a refresh in Todo.jsx
        hide();
      } else {
        setError(result.error || "Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      setError("An error occurred while saving the task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-opacity-50">
      <div className="relative max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
          <button onClick={hide} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter task title"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Task List</label>
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={task}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index] = e.target.value;
                  setTasks(updatedTasks);
                }}
                className="p-2 border rounded-md w-full"
                placeholder={`Task ${index + 1}`}
              />
              {tasks.length > 1 && (
                <button onClick={() => removeTask(index)} className="px-3 py-2 bg-red-500 text-white rounded-lg">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button onClick={addTask} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Add Task
        </button>

        <button onClick={handleSave} className="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
          Save Task
        </button>
      </div>
    </div>
  );
}
