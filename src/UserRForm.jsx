import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const UserRForm = () => {

    const {id} = useParams();

    const [user, setUser] = useState({
        fullname: '',
        pin: '',
        avatar: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation(); // To access the state passed from

    useEffect(() => {
        if (state?.user) {
            console.log('User loaded:', state.user); // Verify it includes the `id` field
            setUser(state.user); // Load selected user data
            setImagePreview(state.user.avatar_url); // Show the preview image
        } else {
            navigate('/UsersRList'); // Redirect if no user is in the state
        }
    }, [state, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError('The file must be of type JPG, JPEG, PNG, or GIF.');
                return;
            }
    
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, avatar: file }); // Ensure this is a file
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic frontend validation
        if (!user.fullname || !user.pin) {
            setError('All fields are required.');
            return;
        }
    
        const formData = new FormData();
        formData.append('fullname', user.fullname);
        formData.append('pin', user.pin);
    
        if (user.avatar) {
            formData.append('avatar', user.avatar);
        }
    
        // Get the token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('You are not authenticated. Please log in.');
            return;
        }
    
        try {
            console.log('Data to send:', {
                id: user.id,  // Include the id here
                fullname: user.fullname,
                pin: user.pin,
                avatar: user.avatar,
            });
    
            const response = await axios.post(
                `http://localhost:8000/api/updateRestrictedUsers/${user.id}`, // Ensure the id is in the URL
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,  // Add the token to the header
                    },
                }
            );
    
            console.log('Server response:', response.data);
    
            if (response.data.message === "Restricted user successfully updated") {
                console.log('User updated:', response.data.user);
            
                // Update state with the data returned from the server
                setUser(response.data.user);
            
                // Redirect to the user list
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
            {/* Main form container */}
            <div className="w-full max-w-md p-6 bg-blue-950 rounded-lg shadow-md text-white">
                {/* Error message */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
    
                {/* Form title */}
                <h3 className="text-xl font-semibold mb-4 text-center">Edit User</h3>
    
                {/* Full name field */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={user.fullname}
                    onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                {/* PIN field */}
                <input
                    type="text"
                    placeholder="PIN"
                    value={user.pin}
                    onChange={(e) => setUser({ ...user, pin: e.target.value })}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                {/* Image field */}
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="mb-4 p-2 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                />

                {/* Image preview */}
                {imagePreview && (
                    <div className="flex justify-center mb-4">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full" />
                    </div>
                )}
                
                {/* Save changes button */}
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
