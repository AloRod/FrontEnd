import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      localStorage.setItem('auth_token', response.data.token);
      setMessage(<p className="text-green-500">{response.data.message}</p>);
      navigate('/HomeScreen');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'There was a problem logging in.';
      setMessage(<p className="text-red-500">{errorMessage}</p>);
    }
  };

  return (
    
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 ">
        <h2 className="text-3xl font-bold text-center text-rose-800 mb-6 ">Welcome KidsYT</h2>
        {message && <div className="mb-4 text-center">{message}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Log in
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <a href="/Register" className="text-blue-600 font-semibold hover:underline">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

