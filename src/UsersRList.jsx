import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersRList = () => {
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ fullname: "", pin: "", avatar: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.get("http://localhost:8000/api/restrictedUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("There was an error loading the user list.");
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
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", newUser.fullname);
    formData.append("pin", newUser.pin);
    formData.append("avatar", newUser.avatar);

    try {
      await axios.post("http://localhost:8000/api/CreaterestrictedUsers", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });

      setIsAdding(false);
      setNewUser({ fullname: "", pin: "", avatar: null });
      setImagePreview(null);
      setError(null);

      const response = await axios.get("http://localhost:8000/api/restrictedUsers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      setError("There was an error adding the user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/DeleteUserRestricted/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = async (userId) => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('You are not authenticated. Please log in.');
            return;
        }

        const response = await axios.get(`http://localhost:8000/api/restrictedUsers/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Asegúrate de que la respuesta contenga los datos del usuario
        const userData = response.data.user || response.data;

        console.log('Navigating with user data:', userData); // Depuración

        if (!userData) {
            throw new Error('User data is missing from the server response.');
        }

        navigate(`/UserRForm/${userData.id}`, { state: { user: userData } });
    } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        alert('There was an error loading the user data.');
    }
};

  return (
    <div className="p-6 flex flex-col items-center bg-black h-screen w-screen text-white">
      {/* Error Messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add User Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-600 text-xs px-2 py-1 rounded hover:bg-green-700 transition-colors mb-4"
        >
          Add New User
        </button>
      )}

      {/* Add User Form */}
      {isAdding && (
        <div className="w-full max-w-sm bg-gray-900 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.fullname}
            onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
            className="mb-2 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="PIN"
            value={newUser.pin}
            onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
            className="mb-2 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full mb-4 mx-auto" />
          )}
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors text-sm"
          >
            Add User
          </button>
        </div>
      )}

      {/* User List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center w-full max-w-6xl">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col items-center bg-gray-900 p-2 rounded-lg shadow-md">
            <img src={user.avatar_url} alt={user.fullname} className="w-16 h-16 rounded-full mb-2" />
            <h3 className="text-sm font-semibold text-white">{user.fullname}</h3>
            <p className="text-xs text-gray-400">PIN: {user.pin}</p>
            <div className="flex space-x-2 mt-2 w-full">
              <button
                onClick={() => handleEditUser(user.id)}
                className="bg-yellow-500 text-xs px-2 py-1 rounded hover:bg-yellow-600 transition-colors w-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-600 text-xs px-2 py-1 rounded hover:bg-red-700 transition-colors w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersRList;
