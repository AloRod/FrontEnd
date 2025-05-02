import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import GraphQLClient from './utils/GraphQLClient';
const UserRForm = () => {
    const { id } = useParams(); // Obtiene el ID del usuario de la URL
    const { state } = useLocation(); // Obtiene el estado pasado durante la navegación
    const [user, setUser] = useState({
        id: null,
        fullname: '',
        pin: '',
        avatar: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let userData;

                // Intenta cargar los datos del estado
                if (state?.user) {
                    userData = state.user;
                } else {
                    const query = `
                    query GetRestrictedUser($id: ID) {
                        myRestrictedUsers(id: $id) {
                            id
                            fullname
                            pin
                            avatar
                            avatar_url
                        }
                    }
                `;

                    const variables = { id };
                    const result = await GraphQLClient.query(query, variables);

                    userData = result.myRestrictedUsers[0];

                    if (!userData) {
                        throw new Error('User not found');
                    }
                }

                console.log('Loaded user data:', userData);

                setUser({
                    id: userData.id,
                    fullname: userData.fullname || '',
                    pin: userData.pin || '',
                    avatar: userData.avatar || null,
                });

                setImagePreview(userData.avatar_url || null);
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data || error.message);
                setError('There was an error loading the user data.');
                navigate('/UsersRList');
            }
        };

        fetchUserData();
    }, [id, state, navigate]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: file || prevUser.avatar,
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.fullname || !user.pin) {
            setError('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('fullname', user.fullname);
        formData.append('pin', user.pin);

        if (user.avatar instanceof File) {
            formData.append('avatar', user.avatar);
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('You are not authenticated. Please log in.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/updateRestrictedUsers/${user.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.message === "Restricted user successfully updated") {
                setUser(response.data.user);
                navigate('/UsersRList');
            } else {
                setError(response.data.message || 'The update was not completed successfully.');
            }
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'There was an error updating the user.');
        }
    };

    return (
        <div className="h-screen w-screen bg-black flex justify-center items-center">
            <div className="w-full max-w-md p-6 bg-blue-950 rounded-lg shadow-md text-white">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <h3 className="text-xl font-semibold mb-4 text-center">Edit User</h3>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={user.fullname || ''}
                    onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                <input
                    type="text"
                    placeholder="PIN"
                    value={user.pin || ''}
                    onChange={(e) => setUser({ ...user, pin: e.target.value })}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                <input
                    type="file"
                    onChange={handleImageChange}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                {imagePreview && (
                    <div className="flex justify-center mb-4">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full" />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default UserRForm;