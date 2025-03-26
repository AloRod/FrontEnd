import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="h-screen w-screen bg-black">
        {/* Contenedor principal con padding-top */}
        <div className="pt-20"> {/* Espacio para el Navbar */}
            <div className="flex justify-center items-center h-full">
                <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800">
                    <h2 className="text-3xl font-semibold text-red-900 mb-8">Panel de Administración</h2>
                    
                    <div className="flex gap-6 mb-8 flex-wrap justify-center">
                        {/* Card 1: Gestionar Videos */}
                        <div 
                            className="bg-white shadow-lg rounded-lg p-6 w-64 cursor-pointer hover:shadow-2xl transition-transform transform hover:translate-y-1"
                            onClick={() => navigate('/VideoList')}
                        >
                            <h3 className="text-xl text-indigo-600 font-semibold mb-4">Gestionar Videos</h3>
                            <p className="text-gray-600">Administra los videos disponibles para la plataforma.</p>
                        </div>

                        {/* Card 2: Gestionar Usuarios */}
                        <div 
                            className="bg-white shadow-lg rounded-lg p-6 w-64 cursor-pointer hover:shadow-2xl transition-transform transform hover:translate-y-1"
                            onClick={() => navigate('/UserRList')}
                        >
                            <h3 className="text-xl text-indigo-600 font-semibold mb-4">Gestionar Usuarios</h3>
                            <p className="text-gray-600">Gestiona y supervisa a los usuarios registrados.</p>
                        </div>

                     {/* Card 3: Gestionar Playlists */}
                     <div 
                                className="bg-white shadow-lg rounded-lg p-6 w-64 cursor-pointer hover:shadow-2xl transition-transform transform hover:translate-y-1"
                                onClick={() => navigate('/PlaylistManager')}
                            >
                                <h3 className="text-xl text-indigo-600 font-semibold mb-4">Gestionar Playlists</h3>
                                <p className="text-gray-600">Crea, edita y elimina playlists de la plataforma.</p>
                            </div>
                        </div>

                        {/* Botón de Cerrar Sesión */}
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-600 transition-colors"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;