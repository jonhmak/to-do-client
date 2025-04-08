import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddModal from "../component/AddModal";

function Todo() {
  const navigate = useNavigate();
  const [titles, setTitles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/"); // Redirect if not authenticated
      return;
    }

    // Fetch titles from backend
    const getTitles = async () => {
      try {
        const response = await axios.get `${process.env.ENDPOINT_URL}/get-titles`;
        setTitles(response.data.titles || []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };

    getTitles();
  }, [navigate]);

  const addTask = async (newTask) => {
    try {
      const response = await axios.post(`${process.env.ENDPOINT_URL}/add-title`, {
        title: newTask.title,
        tasks: newTask.tasks, // Assuming tasks is an array
      });

      if (response.data.success) {
        setTitles((prevTitles) => [...prevTitles, { title: newTask.title, tasks: newTask.tasks || [] }]);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const removeTask = async (titleIndex, taskIndex) => {
    const updatedTitles = titles.map((title, idx) => {
      if (idx === titleIndex) {
        return { ...title, tasks: title.tasks.filter((_, i) => i !== taskIndex) };
      }
      return title;
    });

    setTitles(updatedTitles);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-amber-100">
      <div className="w-[400px] bg-blue-400 p-6 rounded-3xl shadow-lg border-amber-400">
        <h2 className="text-2xl font-bold text-center text-black mb-4">To-Do List</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-center font-semibold mb-2 text-black">Tasks</h3>
            <ul className="space-y-2">
              {titles.length > 0 ? (
                titles.map((title, titleIndex) => (
                  <div key={titleIndex}>
                    <li className="p-3 bg-blue-300 rounded-md text-center">{title.title}</li>
                    {title.tasks && title.tasks.length > 0 ? (
                      <ul>
                        {title.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="bg-yellow-500 text-center p-2 rounded-lg flex justify-between items-center">
                            <span>{task}</span>
                            <button
                              onClick={() => removeTask(titleIndex, taskIndex)}
                              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500">No tasks for this title</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No tasks available</p>
              )}
            </ul>
          </div>

          <div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddModal
          hide={() => setShowModal(false)}
          onAddTask={(newTask) => addTask(newTask)}
        />
      )}
    </div>
  );
}

export default Todo;
