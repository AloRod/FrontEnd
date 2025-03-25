import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/'); // Redirige al login
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-blue-950 text-white p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Botón de Inicio */}
                <Link to="/HomeScreen" className="text-xl font-bold hover:text-blue-300">
                    Inicio
                </Link>

                {/* Menú desplegable (opcional) */}
                <div className="relative">
                  
                    <ul
                        className="absolute right-0 hidden bg-white text-gray-700 pt-2 w-44"
                        aria-labelledby="dropdownMenuButton"
                    >
                        <li>
                            <Link
                                to="/HomeScreen "
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                HomeScreen
                            </Link>
                        </li>
                       
                    </ul>
                </div>

                {/* Botón de Cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;