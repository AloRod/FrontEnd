import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [users, setUsers] = useState([]); // Asegura que users siempre sea un array
  const [adminPin, setAdminPin] = useState('');
  const [userPin, setUserPin] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.error('No hay token de autenticación, por favor inicie sesión.');
          return;
        }
  
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log('Respuesta de la API:', response.data); // Agregar este log
  
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Si la respuesta es un array directamente
        } else if (Array.isArray(response.data.restricted_users)) {
          setUsers(response.data.restricted_users);
        } else {
          console.error('La respuesta de la API no contiene un array de usuarios.');
        }
  
      } catch (error) {
        console.error('Error al obtener los usuarios:', error.response?.data || error);
      }
    };

    fetchUsers();
  }, []);

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setMessage('No autenticado, por favor inicie sesión.');
        return;
      }
      const response = await axios.post(
        'http://localhost:8000/api/validateAdminPin',
        { pin: adminPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.message === 'Acceso permitido a administración') {
        navigate('/AdminDasshboard');
      } else {
        setMessage('PIN incorrecto.');
      }
    } catch (error) {
      setMessage('PIN INCORRECTO');
      console.error('Error validando PIN de administrador:', error);
    }
  };

  const handleUserAccess = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await axios.post('http://localhost:8000/api/validateUserPin', { userId: selectedUser.id, pin: userPin });
      navigate(`/UserDashboard`);
    } catch (error) {
      setMessage('PIN incorrecto.');
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-xl backdrop-blur-md flex flex-col space-y-8">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6">Home Screen</h2>

        {message && <div className="text-center text-red-500 mb-4">{message}</div>}

        <form onSubmit={handleAdminAccess} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-white">Administrator PIN</label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-xl mt-2 focus:ring-2 focus:ring-red-500"
              placeholder="Ingrese su PIN"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
          >
            Acceder
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold text-white text-center mb-4">¿Quién está viendo ahora?</h3>
          <div className="flex overflow-x-auto space-x-6 justify-center mb-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-24 h-24 bg-gray-700 rounded-full cursor-pointer hover:opacity-80 transition duration-300"
                >
                  <img
                    src={user.avatar || 'https://via.placeholder.com/150'}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full border-2 border-gray-600"
                  />
                  <p className="text-center text-white mt-2 text-sm">{user.name}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-white">Cargando usuarios...</p>
            )}
          </div>
        </div>

        {selectedUser && (
          <form onSubmit={handleUserAccess} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white">PIN de {selectedUser.name}</label>
              <input
                type="password"
                value={userPin}
                onChange={(e) => setUserPin(e.target.value)}
                className="w-full p-4 border-2 border-gray-500 rounded-xl mt-2 focus:ring-2 focus:ring-red-500"
                placeholder="Ingrese el PIN"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Acceder a Playlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
