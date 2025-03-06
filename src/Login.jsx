import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Usamos el hook useNavigate para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      setMessage(<p className="text-green-500">{response.data.message}</p>);

      // Si el login es exitoso, redirigimos a la página de Dashboard
      navigate('/dashboard'); // Esto redirige a /dashboard

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'There was a problem logging in.';
      setMessage(<p className="text-red-500">{errorMessage}</p>);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 h-auto p-8 border-2 border-gray-200 bg-white rounded-lg shadow-xl backdrop-blur-md flex flex-col">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Welcome!</h2>

        {message && <div className="mb-4">{message}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-lg text-black font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 text-black focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-lg text-black font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 text-black focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Log in
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <a
            href="/Register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
