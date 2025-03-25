// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');  // Elimina el token del localStorage
    navigate('/Login');  // Redirige a la página de Login
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/HomeScreen">Home</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;



