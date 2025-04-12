
/*const PlaylistList = ({ playlists, onSelectPlaylist, onDeletePlaylist }) => {
  // Obtener el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');  // Asegúrate de que el token se haya guardado previamente

  // Función para eliminar playlist con autenticación
  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Incluir el token en los headers
        }
      });

      if (response.ok) {
        onDeletePlaylist(playlistId);  // Llamar la función de callback si la eliminación fue exitosa
      } else {
        console.error('Error al eliminar la playlist');
      }
    } catch (error) {
      console.error('Hubo un error al intentar eliminar la playlist:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id} className="flex justify-between items-center mb-2">
            <span
              className="cursor-pointer text-indigo-600 hover:underline"
              onClick={() => onSelectPlaylist(playlist)}
            >
              {playlist.name}
            </span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeletePlaylist(playlist.id)}  // Usar la nueva función para eliminar
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Not authenticated, please log in.");
          return;
        }

        // Try to get playlists from localStorage first
        const cachedPlaylists = localStorage.getItem("user_playlists");
        
        if (cachedPlaylists) {
          setPlaylists(JSON.parse(cachedPlaylists));
          setLoading(false);
          // Clean localStorage after using it
          localStorage.removeItem("user_playlists");
        } else {
          // If no data in localStorage, get it from the API
          const response = await axios.get(
            `http://localhost:8000/api/users/${userId}/playlists`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.playlists) {
            // Map the API response format to match the component's expected format
            const formattedPlaylists = response.data.playlists.map(playlist => ({
              id: playlist.id,
              title: playlist.name,
              songs: new Array(playlist.video_count), // This creates an array with the correct length
              description: "", // The API doesn't provide a description, so use empty string
              cover_image: null // The API doesn't provide a cover image
            }));
            
            setPlaylists(formattedPlaylists);
          } else {
            setError("No playlists found");
          }
          setLoading(false);
        }
      } catch (err) {
        setError("Error loading playlists. Please try again.");
        console.error("Error fetching playlists:", err);
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-pulse text-4xl text-red-500">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Video Collections
        </h1>

        {playlists.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-12">
            No playlists found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
                className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-red-500 cursor-pointer"
              >
                <div className="relative">
                  <div className="h-40 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    {playlist.cover_image ? (
                      <img
                        src={playlist.cover_image}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl text-white">
                        📹
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {playlist.songs?.length || 0} videos
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2 truncate">
                    {playlist.title}
                  </h3>
                  <p className="text-gray-400 text-sm h-12 overflow-hidden">
                    {playlist.description
                      ? playlist.description.substring(0, 60) + (playlist.description.length > 60 ? '...' : '')
                      : "Click to view videos"}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <span className="inline-flex items-center text-red-400 text-sm">
                      Watch now
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistList;
