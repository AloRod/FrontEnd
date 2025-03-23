import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-black">
             <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 ">
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
                </div>
            </div>
            </div>
        );
    };
    
    export default AdminDashboard;
