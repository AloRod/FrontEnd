import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersRList = () => {
    const [users, setUsers] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ fullname: '', pin: '', avatar: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('http://localhost:8000/api/restrictedUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setError('Hubo un error al obtener la lista de usuarios.');
            }
        };
        fetchUsers();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUser({ ...newUser, avatar: file });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddUser = async () => {
        if (!newUser.fullname || !newUser.pin || !newUser.avatar) {
            setError('Todos los campos son requeridos.');
            return;
        }

        const formData = new FormData();
        formData.append('fullname', newUser.fullname);
        formData.append('pin', newUser.pin);
        formData.append('avatar', newUser.avatar);

        try {
            await axios.post('http://localhost:8000/api/CreaterestrictedUsers', formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
            });

            setIsAdding(false);
            setNewUser({ fullname: '', pin: '', avatar: null });
            setImagePreview(null);
            setError(null);
            
            const response = await axios.get('http://localhost:8000/api/restrictedUsers', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            setUsers(response.data);
        } catch (error) {
            setError('Hubo un error al agregar el usuario.');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/DeleteUserRestricted/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error al eliminar usuario', error);
        }
    };

    const handleEditUser = (user) => {
        navigate(`/UserRForm/${user.id}`, { state: { user } });
    };

    return (
        <div className="p-6 flex flex-col md:flex-row gap-6 ">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white p-1 rounded mb-1 hover:bg-green-700">
                    Agregar Nuevo Usuario
                </button>
            )}
            {isAdding && (
                <div className="w-full max-w-lg bg-gray-800 text-white p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Usuario</h3>
                    <input type="text" placeholder="Nombre completo" value={newUser.fullname} onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} className="mb-2 p-2 w-full rounded text-black" />
                    <input type="text" placeholder="PIN" value={newUser.pin} onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })} className="mb-2 p-2 w-full rounded text-black" />
                    <input type="file" onChange={handleImageChange} className="p-2 w-full rounded" />
                    <button onClick={handleAddUser} className="bg-blue-600 text-white p-2 rounded mt-4 w-full hover:bg-blue-700">
                        Agregar Usuario
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                        <img src={user.avatar_url} alt={user.fullname} className="w-24 h-24 rounded-full mb-4" />
                        <h3 className="text-xl font-semibold text-black">{user.fullname}</h3>
                        <p className="text-gray-500">PIN: {user.pin}</p>
                        <div className="flex space-x-4 mt-4">
                            <button onClick={() => handleEditUser(user)} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                Editar
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="bg-red-600 text-white p-2 rounded hover:bg-red-700">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersRList;
