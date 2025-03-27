import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [adminPin, setAdminPin] = useState("");
  const [userPin, setUserPin] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [playlists, setPlaylists] = useState([]); // Para almacenar las playlists
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No authentication token, please log in.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (Array.isArray(response.data.restricted_users)) {
          setUsers(response.data.restricted_users);
        } else {
          console.error("API response does not contain an array of users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error);
      }
    };

    fetchUsers();
  }, []);

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Not authenticated, please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/validateAdminPin",
        { pin: adminPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Access granted to administration") {
        navigate("/AdminDasshboard");
      } else {
        setMessage("Incorrect PIN.");
      }
    } catch (error) {
      setMessage("INCORRECT PIN");
      console.error("Error validating admin PIN:", error);
    }
  };

  const handleUserAccess = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage("Please select a user.");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Not authenticated, please log in.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/validateUserPin/${selectedUser.id}`,
        { pin: userPin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Access granted to user") {
        // Obtener playlists del usuario
        const playlistsResponse = await axios.get(
          `http://localhost:8000/api/users/${selectedUser.id}/playlists`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPlaylists(playlistsResponse.data); // Guardar las playlists en el estado // Guardar las playlists en el estado
        navigate("/PlaylistList");
      } else {
        setMessage("Error validating PIN.");
      }
    } catch (error) {
      setMessage("Incorrect PIN.");
      console.error("Error validating restricted user PIN:", error.response?.data || error.message);
    }
  };
 
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <form onSubmit={handleAdminAccess} className="flex flex-col space-y-2">
          <input
            type="password"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            className="w-48 p-2 border border-gray-500 rounded-md text-white bg-gray-800 focus:outline-none focus:border-red-500"
            placeholder="Admin PIN"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition duration-300"
          >
            Access as Admin
          </button>
        </form>
      </div>

      {message && <div className="text-center text-red-500 mb-4">{message}</div>}

      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-4xl font-bold text-white">Who is watching now?</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300"
              >
                <img
                  src={user.avatar_url}
                  alt={user.fullname}
                  className="w-32 h-32 object-cover rounded-md border-4 border-white"
                />
                <p className="text-white mt-2 text-lg font-semibold">{user.fullname}</p>
              </div>
            ))
          ) : (
            <p className="text-white">Loading users...</p>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <form onSubmit={handleUserAccess} className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-4">
            <h3 className="text-2xl font-bold text-white text-center">Access for {selectedUser.fullname}</h3>
            <div>
              <label className="block text-lg font-medium text-white">PIN</label>
              <input
                type="password"
                value={userPin}
                onChange={(e) => setUserPin(e.target.value)}
                className="w-full p-3 border border-gray-500 rounded-md text-white bg-gray-800 focus:outline-none focus:border-red-500"
                placeholder="Enter your PIN"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Access
            </button>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mostrar playlists si están disponibles */}
      {playlists.length > 0 && (
        <div className="text-white mt-8">
          <h3 className="text-2xl font-bold">Playlists for {selectedUser?.fullname}</h3>
          <ul className="space-y-4">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="text-lg">
                {playlist.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
