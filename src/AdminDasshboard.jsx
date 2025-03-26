import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Function to log out
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-black">
      {/* Main container with padding-top */}
      <div className="pt-20"> {/* Space for the Navbar */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-full max-w-4xl p-8 rounded-lg shadow-lg bg-gray-900 space-y-8">
            {/* Title */}
            <h2 className="text-4xl font-bold text-white text-center">Admin Dashboard</h2>

            {/* Cards section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Manage Videos */}
              <div
                className="bg-gray-800 shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors transform hover:scale-105"
                onClick={() => navigate("/VideoList")}
              >
                <h3 className="text-xl text-red-500 font-semibold mb-4">Manage Videos</h3>
                <p className="text-gray-400">Manage the videos available on the platform.</p>
              </div>

              {/* Card 2: Manage Users */}
              <div
                className="bg-gray-800 shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors transform hover:scale-105"
                onClick={() => navigate("/UsersRList")}
              >
                <h3 className="text-xl text-red-500 font-semibold mb-4">Manage Users</h3>
                <p className="text-gray-400">Manage and monitor registered users.</p>
              </div>

              {/* Card 3: Manage Playlists */}
              <div
                className="bg-gray-800 shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors transform hover:scale-105"
                onClick={() => navigate("/PlaylistManager")}
              >
                <h3 className="text-xl text-red-500 font-semibold mb-4">Manage Playlists</h3>
                <p className="text-gray-400">Create, edit, and delete playlists on the platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;