import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/google/success', { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = () => {
    const googleAuthURL = 'http://localhost:5000/auth/google';
    window.open(googleAuthURL, '_self');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="w-full bg-blue-600 py-4 text-white text-center">
        <h1 className="text-3xl font-bold">Rrobotika Hf</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login with Google
          </button>
        ) : (
          <Profile user={user} />
        )}
      </main>
      <footer className="w-full bg-gray-200 py-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Rrobotika Hf. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
