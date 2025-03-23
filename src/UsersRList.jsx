import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersRList = () => {
    const [users, setUsers] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({
        fullname: '',
        pin: '',
        avatar: ''
    });
    const [imagePreview, setImagePreview] = useState(null);  // Para mostrar la imagen seleccionada
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Obtener la lista de usuarios restringidos
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('http://localhost:8000/api/restrictedUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setError('Hubo un error al obtener la lista de usuarios.');
            }
        };
        fetchUsers();
    }, []);

    // Manejar la selección de imagen para el avatar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUser({ ...newUser, avatar: file.name });  // Guardamos el nombre del archivo
                setImagePreview(reader.result);  // Mostramos la imagen seleccionada
            };
            reader.readAsDataURL(file);
        }
    };

    // Manejar la selección de una imagen predefinida
    const handleImageSelect = (imageName) => {
        setNewUser({ ...newUser, avatar: imageName });
        setImagePreview(`path_to_images/${imageName}`);  // Ruta a la imagen predefinida
    };

    // Agregar un nuevo usuario restringido
    const handleAddUser = async () => {
        if (!newUser.fullname || !newUser.pin || !newUser.avatar) {
            setError('Todos los campos son requeridos.');
            return;
        }
        if (newUser.pin.length !== 6 || isNaN(newUser.pin)) {
            setError('El PIN debe ser un número de 6 dígitos.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/CreaterestrictedUsers', newUser, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            setIsAdding(false); // Cerrar formulario de agregar
            setNewUser({ fullname: '', pin: '', avatar: '' }); // Limpiar formulario
            setImagePreview(null); // Limpiar la vista previa
            setError(null); // Limpiar error

            // Actualizar la lista de usuarios
            const response = await axios.get('http://localhost:8000/api/restrictedUsers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error al agregar usuario', error);
            setError('Hubo un error al agregar el usuario.');
        }
    };

    // Eliminar un usuario restringido
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/DeleterestrictedUsers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            // Actualizar la lista de usuarios
            const response = await axios.get('http://localhost:8000/api/restrictedUsers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error al eliminar usuario', error);
            setError('Hubo un error al eliminar el usuario.');
        }
    };

    // Editar usuario restringido
    const handleEditUser = (user) => {
        navigate(`/editUser/${user.id}`, { state: { user } });
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}
            
            {/* Botón para agregar nuevo usuario */}
            {!isAdding && (
                <button 
                    onClick={() => setIsAdding(true)} 
                    className="bg-green-600 text-white p-2 rounded mb-4 hover:bg-green-700"
                >
                    Agregar Nuevo Usuario
                </button>
            )}

            {/* Formulario para agregar un nuevo usuario */}
            {isAdding && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-blue-950">
                    <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Usuario</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={newUser.fullname}
                            onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="PIN"
                            value={newUser.pin}
                            onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Selector de imagen (Archivo) */}
                    <div className="mb-4">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img src={imagePreview} alt="Vista previa" className="w-32 h-32 object-cover rounded" />
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            onClick={handleAddUser}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Agregar Usuario
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de usuarios */}
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                        <div className="flex flex-col md:flex-row items-center w-full">
                            <img
                                src={`path_to_images/${user.avatar}`} // Asegúrate de que la ruta sea correcta
                                alt={user.fullname}
                                className="w-16 h-16 rounded-full mb-4 md:mb-0 md:mr-4"
                            />
                            <div className="flex flex-col md:flex-row md:items-center w-full">
                                <div className="md:mr-6">
                                    <h3 className="text-xl font-semibold">{user.fullname}</h3>
                                    <p className="text-gray-500">PIN: {user.pin}</p>
                                </div>

                                <div className="mt-4 md:mt-0 flex space-x-4">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersRList;
