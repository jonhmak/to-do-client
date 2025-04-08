import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

function App() {
  const navigate = useNavigate();

   const apiUrl = import.meta.env.VITE_ENDPOINT_URL;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.ENDPOINT_URL}/check-user`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.exist) {
        localStorage.setItem('isAuthenticated', 'true');
        setError('');
        navigate('/todo');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Something went wrong, please try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-500">
      <div className="w-[400px] h-[500px] bg-black flex flex-col justify-center p-5 gap-5 text-white rounded-lg shadow-lg">
        <h1 className="text-5xl mx-5 py-5 text-center font-bold text-blue-500">FACEbook</h1>

        {error && <div className="bg-red-500 text-white p-3 rounded-lg font-medium">{error}</div>}

        <div className="flex flex-col">
          <label htmlFor="username" className="font-medium mb-1">Username:</label>
          <input
            type="text"
            id="username"
            className="outline-none p-2 rounded-md border border-gray-500 bg-gray-800 text-white focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-medium mb-1">Password:</label>
          <input
            type="password"
            id="password"
            className="outline-none p-2 rounded-md border border-gray-500 bg-gray-800 text-white focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white py-3 font-medium text-xl hover:bg-blue-600 rounded-md transition-all mt-5"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}

export default App;
