import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your backend URL

const PlaylistForm = ({ playlist, onSave, onCancel }) => {
  const [name, setName] = useState(playlist?.name || "");
  const [adminId, setAdminId] = useState(playlist?.admin_id || ""); // Admin ID
  const [associatedProfiles, setAssociatedProfiles] = useState(
    playlist?.associated_profiles || []
  ); // Associated profile IDs
  const [error, setError] = useState(null); // State to handle errors

  // Get the authentication token from localStorage
  const token = localStorage.getItem("auth_token"); // Ensure the token is saved previously

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validate that required fields are not empty
    if (!name.trim()) {
      setError("The playlist name is required.");
      return;
    }
    if (!adminId || isNaN(adminId)) {
      setError("The admin ID is required and must be a valid number.");
      return;
    }

    try {
      const data = {
        name,
        admin_id: Number(adminId), // Convert to number
        associated_profiles: Array.isArray(associatedProfiles)
          ? associatedProfiles.map(Number) // Convert IDs to numbers
          : [],
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
          "Content-Type": "application/json",
        },
      };

      if (playlist) {
        // Edit existing playlist
        const response = await axios.put(`${API_URL}/playlists/${playlist.id}`, data, config);
        onSave(response.data); // Notify parent component
      } else {
        // Create new playlist
        const response = await axios.post(`${API_URL}/playlists`, data, config);
        onSave(response.data); // Notify parent component
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
      setError("There was an error saving the playlist. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-md text-white">
      {/* Form Title */}
      <h2 className="text-xl font-bold mb-4 text-center">
        {playlist ? "Edit Playlist" : "Create New Playlist"}
      </h2>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Playlist Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Playlist Name</label>
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400"
          />
        </div>

        {/* Admin ID Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Admin ID</label>
          <input
            type="number"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400"
          />
        </div>

        {/* Associated Profiles Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">
            Associated Profile IDs (comma-separated)
          </label>
          <input
            type="text"
            placeholder="Example: 1,2,3"
            value={associatedProfiles.join(",")}
            onChange={(e) =>
              setAssociatedProfiles(e.target.value.split(",").map((id) => id.trim()))
            }
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            {playlist ? "Update Playlist" : "Create Playlist"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;
