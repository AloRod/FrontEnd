import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form behavior

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      // If the response is successful
      setMessage(<p className="text-green-500">{response.data.message}</p>);
      console.log(response.data.user); // You can handle the user response as needed
    } catch (error) {
      // If there's an error
      const errorMessage = error.response?.data?.error || 'There was a problem logging in.';
      setMessage(<p className="text-red-500">{errorMessage}</p>);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-2xl shadow-xl border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome back!</h2>

        {message && <div className="mb-4">{message}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-lg text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-lg text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
