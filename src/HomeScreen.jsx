import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [adminPin, setAdminPin] = useState('');
  const [userPin, setUserPin] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user');
        setUsers(response.data.restrictedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
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
        navigate('/RestrictedUser');
      } else {
        setMessage('PIN incorrecto.');
      }
    } catch (error) {
      setMessage('Error en la conexión con el servidor. Intente más tarde.');
      console.error('Error validando PIN de administrador:', error);
    }
  };

  const handleUserAccess = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await axios.post('http://localhost:8000/api/validateUserPin', { userId: selectedUser.id, pin: userPin });
      navigate(`/playlist/${selectedUser.id}`);
    } catch (error) {
      setMessage(<p className="text-red-500">PIN incorrecto.</p>);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r">
      <div className="w-96 p-8 border-2 border-gray-200 bg-white rounded-lg shadow-xl backdrop-blur-md flex flex-col">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Home Screen</h2>
        {message && <div className="mb-4 text-red-500">{message}</div>}

        <form onSubmit={handleAdminAccess} className="mb-6">
          <label className="block text-lg font-medium text-black">Administrator pin</label>
          <input
            type="password"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:ring-2 focus:ring-purple-500, text-black"
            placeholder="Ingrese su PIN"
            required
          />
          <button type="submit" className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            access
          </button>
        </form>

        <h3 className="text-xl font-semibold text-black mb-4">WHO IS WATCHING NOW?</h3>
        <div className="flex overflow-x-scroll space-x-4 mb-6">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-24 h-24 bg-gray-300 rounded-full cursor-pointer hover:opacity-80"
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
              />
              <p className="text-center text-black mt-2">{user.name}</p>
            </div>
          ))}
        </div>

        {selectedUser && (
          <form onSubmit={handleUserAccess} className="mt-6">
            <label className="block text-lg font-medium text-black">PIN de {selectedUser.name}</label>
            <input
              type="password"
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mt-2 focus:ring-2 focus:ring-purple-500"
              placeholder="Ingrese el PIN"
              required
            />
            <button type="submit" className="w-full py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
              Acceder a Playlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
