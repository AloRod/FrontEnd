import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
// TEST FOR UPLOADING THE FRONTEND
const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [associatedProfiles, setAssociatedProfiles] = useState([]); // Array of associated profile IDs
  const [restrictedUsers, setRestrictedUsers] = useState([]); // List of restricted users
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get token and user_id from localStorage
  const getToken = () => localStorage.getItem('auth_token');
  const getUserId = () => {
    const userId = localStorage.getItem('user_id'); // Read user_id from localStorage
    return userId ? parseInt(userId, 10) : null; // Convert to number
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // Fetch playlists
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        // Convert associated_profiles from JSON strings to arrays
        const playlistsWithParsedProfiles = response.data.map((playlist) => ({
          ...playlist,
          associated_profiles: playlist.associated_profiles
            ? JSON.parse(playlist.associated_profiles)
            : [],
        }));
        setPlaylists(playlistsWithParsedProfiles);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setError('There was an error loading the playlists.');
      });
  }, []);

  // Fetch restricted users
  useEffect(() => {
    axios
      .get(`${API_URL}/restrictedUsers`, getAuthHeaders())
      .then((response) => {
        setRestrictedUsers(response.data); // Store the list of restricted users
      })
      .catch((error) => {
        console.error('Error fetching restricted users:', error);
        setError('There was an error loading the restricted users.');
      });
  }, []);

  const handleCreateOrUpdatePlaylist = async () => {
    if (!name.trim()) {
      setError('The playlist name is required.');
      return;
    }

    setLoading(true);

    try {
      const userId = getUserId(); // Get user_id from localStorage

      if (!userId || isNaN(userId)) {
        throw new Error('Could not retrieve user ID or it is invalid.');
      }

      // Validate and convert associated_profiles to numbers
      const profiles = Array.isArray(associatedProfiles)
        ? associatedProfiles.map(Number).filter((id) => !isNaN(id))
        : [];

      const data = {
        name,
        description,
        user_id: userId, // Use user_id from localStorage
        admin_id: userId, // Send the same user_id as admin_id
        associated_profiles: profiles, // Send as an empty array if no associated profiles
      };

      let response;
      if (editingPlaylistId) {
        // Edit existing playlist
        response = await axios.put(
          `${API_URL}/playlists/${editingPlaylistId}`,
          data,
          getAuthHeaders()
        );
      } else {
        // Create new playlist
        response = await axios.post(`${API_URL}/playlists`, data, getAuthHeaders());
      }

      // Update playlist list
      setPlaylists(
        editingPlaylistId
          ? playlists.map((p) => (p.id === editingPlaylistId ? response.data : p))
          : [...playlists, response.data]
      );

      // Clear the form
      setName('');
      setDescription('');
      setAssociatedProfiles([]);
      setEditingPlaylistId(null);
      setError(null);
    } catch (error) {
      console.error('Error saving playlist:', error);

      // Display specific backend errors if available
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        setError(errors.join(', '));
      } else {
        setError(error.message || 'There was an error saving the playlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setLoading(true);

      try {
        await axios.delete(`${API_URL}/playlists/${playlistId}`, getAuthHeaders());
        setPlaylists(playlists.filter((p) => p.id !== playlistId));
        setError(null);
      } catch (error) {
        console.error('Error deleting playlist:', error);
        setError(error.response?.data?.message || 'There was an error deleting the playlist.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPlaylist = (playlist) => {
    setName(playlist.name);
    setDescription(playlist.description);
    setAssociatedProfiles(playlist.associated_profiles || []); // Load associated profiles
    setEditingPlaylistId(playlist.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Manage Playlists</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form for Creating/Editing Playlists */}
      <form onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdatePlaylist(); }} className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-black">
          {editingPlaylistId ? 'Edit Playlist' : 'Create New Playlist'}
        </h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Playlist Name</label>
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Associated Restricted Users (Hold Ctrl/Cmd to select multiple)
          </label>
          <select
            multiple
            value={associatedProfiles}
            onChange={(e) =>
              setAssociatedProfiles(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="border p-2 w-full"
          >
            {restrictedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullname} (ID: {user.id})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : editingPlaylistId ? 'Update Playlist' : 'Create Playlist'}
          </button>
          {editingPlaylistId && (
            <button
              type="button"
              onClick={() => {
                setName('');
                setDescription('');
                setAssociatedProfiles([]);
                setEditingPlaylistId(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of Playlists */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-black">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-500">No playlists available.</p>
        ) : (
          <ul className="space-y-2">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                <div>
                  <h3 className="font-bold text-black">{playlist.name}</h3>
                  <p className="text-xs text-gray-600">{playlist.description}</p>
                  <p className="text-xs text-gray-500">
                    Associated Profiles:{' '}
                    {Array.isArray(playlist.associated_profiles)
                      ? playlist.associated_profiles.join(', ') || 'None'
                      : 'None'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEditPlaylist(playlist)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;