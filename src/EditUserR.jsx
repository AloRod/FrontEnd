import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EditUserR = () => {
    const [user, setUser] = useState({
        fullname: '',
        pin: '',
        avatar: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation(); // Para acceder al estado pasado desde UsersRList

    useEffect(() => {
        if (state?.user) {
            console.log('Usuario cargado:', state.user); // Verifica que incluya el campo `id`
            setUser(state.user); // Cargar los datos del usuario seleccionado
            setImagePreview(state.user.avatar_url); // Mostrar la imagen previa
        } else {
            navigate('/UserRList'); // Redirigir si no hay usuario en el estado
        }
    }, [state, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError('El archivo debe ser de tipo JPG, JPEG, PNG o GIF.');
                return;
            }
    
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, avatar: file }); // Asegúrate de que esto sea un archivo
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validación básica en el frontend
        if (!user.fullname || !user.pin) {
            setError('Todos los campos son obligatorios.');
            return;
        }
    
        const formData = new FormData();
        formData.append('fullname', user.fullname);
        formData.append('pin', user.pin);
    
        if (user.avatar) {
            formData.append('avatar', user.avatar);
        }
    
        // Obtener el token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión.');
            return;
        }
    
        try {
            console.log('Datos a enviar:', {
                id: user.id,  // Incluye el id aquí
                fullname: user.fullname,
                pin: user.pin,
                avatar: user.avatar,
            });
    
            const response = await axios.put(
                `http://localhost:8000/api/updateRestrictedUsers/${user.id}`, // Asegúrate de que el id esté en la URL
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,  // Aquí se agrega el token al encabezado
                    },
                }
            );
    
            console.log('Respuesta del servidor:', response.data);
    
            if (response.data.success) {
                console.log('Usuario actualizado:', response.data.user);
                
                // Actualiza el estado con los datos devueltos del servidor
                setUser(response.data.user);
            
                // Redirige a la lista de usuarios
                navigate('/UserRList');
            
             
            } else {
                setError(response.data.message || 'La actualización no se completó correctamente.');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Hubo un error al actualizar el usuario.');
        }
    };
    
    
    
    
    return (
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-blue-950 text-white">
                <h3 className="text-xl font-semibold mb-4">Editar Usuario</h3>
                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={user.fullname}
                    onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                    className="mb-2 p-2 border border-gray-300 rounded w-full text-black"
                />
                <input
                    type="text"
                    placeholder="PIN"
                    value={user.pin}
                    onChange={(e) => setUser({ ...user, pin: e.target.value })}
                    className="mb-2 p-2 border border-gray-300 rounded w-full text-black"
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                {imagePreview && (
                    <div className="mt-4">
                        <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="w-24 h-24 rounded-full"
                        />
                    </div>
                )}
                
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
                >
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default EditUserR;
