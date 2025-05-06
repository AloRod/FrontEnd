import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar si el menú está abierto

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/"); // Redirige al login
  };

  return (
    <div className= "bg-black">
      {/* Botón para alternar el menú */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna el estado del menú
        className="ml-6 mt-4 bg-blue-950 text-white p-2 rounded-md hover:bg-blue-800"
      >
        ☰ Menú
      </button>

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full" // Muestra u oculta el menú
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Encabezado del menú */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Menú</h2>
        </div>

        {/* Opciones del menú */}
        <ul className="p-4 space-y-2">
          <li>
            <Link
              to="/HomeScreen"
              className="block px-4 py-2 hover:bg-blue-800 rounded"
              onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
            >
             Home screen
            </Link>
          </li>
         
        </ul>

        {/* Botón de Cerrar sesión */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            log out
          </button>
        </div>
      </div>

      {/* Fondo oscuro cuando el menú está abierto */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic fuera
        ></div>
      )}
    </div>
  );
};

export default Navbar;