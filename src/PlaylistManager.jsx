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
        setError('There was an error loading restricted users.');
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
      {/* The rest of the UI remains unchanged */}
    </div>
  );
};

export default PlaylistManager;
