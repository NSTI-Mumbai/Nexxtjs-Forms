import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formResponses, setFormResponses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
      fetchFormResponses();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        fetchFormResponses();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const fetchFormResponses = async () => {
    try {
      const response = await axios.get('/api/get-responses');
      setFormResponses(response.data.responses);
    } catch (error) {
      console.error('Error fetching form responses:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label className="sr-only">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="sr-only">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Form Responses</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Form Title</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Submission Date</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Answers</th>
          </tr>
        </thead>
        <tbody>
          {formResponses.map((response, index) => (
            <tr key={index}>
              <td className="px-6 py-4 border-b border-gray-300">{response.formId}</td>
              <td className="px-6 py-4 border-b border-gray-300">{new Date(response.submittedAt).toLocaleString()}</td>
              <td className="px-6 py-4 border-b border-gray-300">
                {Object.keys(response.formData).map((questionKey, idx) => (
                  <div key={idx}>
                    <strong>{questionKey}:</strong> {response.formData[questionKey]}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
