import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [associatedProfiles, setAssociatedProfiles] = useState([]);
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('auth_token');
  const getUserId = () => {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
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

  useEffect(() => {
    axios
      .get(`${API_URL}/restrictedUsers`, getAuthHeaders())
      .then((response) => {
        setRestrictedUsers(response.data);
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
      const userId = getUserId();

      if (!userId || isNaN(userId)) {
        throw new Error('Could not retrieve user ID or it is invalid.');
      }

      const profiles = Array.isArray(associatedProfiles)
        ? associatedProfiles.map(Number).filter((id) => !isNaN(id))
        : [];

      const data = {
        name,
        description,
        user_id: userId,
        admin_id: userId,
        associated_profiles: profiles,
      };

      let response;
      if (editingPlaylistId) {
        response = await axios.put(
          `${API_URL}/playlists/${editingPlaylistId}`,
          data,
          getAuthHeaders()
        );
      } else {
        response = await axios.post(`${API_URL}/playlists`, data, getAuthHeaders());
      }

      setPlaylists(
        editingPlaylistId
          ? playlists.map((p) => (p.id === editingPlaylistId ? response.data : p))
          : [...playlists, response.data]
      );

      setName('');
      setDescription('');
      setAssociatedProfiles([]);
      setEditingPlaylistId(null);
      setError(null);
    } catch (error) {
      console.error('Error saving playlist:', error);
      setError(error.response?.data?.message || 'There was an error saving the playlist.');
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
    setAssociatedProfiles(playlist.associated_profiles || []);
    setEditingPlaylistId(playlist.id);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Manage Playlists</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form for Creating/Editing Playlists */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateOrUpdatePlaylist();
        }}
        className="mb-8 bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingPlaylistId ? 'Edit Playlist' : 'Create New Playlist'}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Playlist Name</label>
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-500 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-500 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
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
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-500 text-white"
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
            className={`bg-red-600 text-white px-4 py-2 rounded transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
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
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of Playlists */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400">No playlists available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-red-500/50 transition-shadow duration-300"
              >
                <h3 className="text-lg font-bold mb-2">{playlist.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{playlist.description}</p>
                <p className="text-xs text-gray-400">
                  Associated Profiles:{' '}
                  {Array.isArray(playlist.associated_profiles)
                    ? playlist.associated_profiles.join(', ') || 'None'
                    : 'None'}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 transition duration-300"
                    onClick={() => handleEditPlaylist(playlist)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-300"
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