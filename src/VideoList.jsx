import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaylistForm from './PlaylistForm';
import VideoForm from './VideoForm';

const API_URL = 'http://localhost:8000/api';

const VideoList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);

  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        console.log('Playlists:', response.data);  // Verifica lo que devuelve la API para las playlists
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setError('Hubo un error al cargar las playlists.');
      });
  }, []);

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);

    // Aquí es donde se hace la solicitud para cargar los videos
    axios
      .get(`${API_URL}/playlists/${playlist.id}/videos`, getAuthHeaders())
      .then((response) => {
        console.log('Videos:', response.data);  // Verifica lo que devuelve la API para los videos
        if (response.data && Array.isArray(response.data)) {
          setVideos(response.data);  // Solo guarda los datos si son un array válido
        } else {
          setError('No se encontraron videos.');
        }
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setError('Hubo un error al cargar los videos.');
      });
  };

  const handleAddVideo = () => {
    setShowVideoForm(true); // Muestra el formulario para agregar video
  };

  const handleSaveVideo = (newVideo) => {
    setVideos((prevVideos) => [...prevVideos, newVideo]);
    setShowVideoForm(false); // Cierra el formulario al agregar el video
    alert('Video agregado con éxito'); // Mensaje de éxito
  };

  const handleCancelVideoForm = () => {
    setShowVideoForm(false); // Cierra el formulario si se cancela
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Mis Playlists</h1>

        {/* Mostrar errores de autenticación */}
        {authError && <p className="text-red-500 mb-4">{authError}</p>}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 flex gap-2">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => setShowPlaylistForm(true)}
          >
            {selectedPlaylist ? 'Editar Playlist' : 'Agregar Playlist'}
          </button>
          {selectedPlaylist && !showVideoForm && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleAddVideo}
            >
              Agregar Video
            </button>
          )}
        </div>

        {showPlaylistForm && (
          <PlaylistForm
            playlist={selectedPlaylist}
            onSave={(updatedPlaylist) => {
              if (updatedPlaylist.id) {
                setPlaylists(playlists.map((p) => (p.id === updatedPlaylist.id ? updatedPlaylist : p)));
              } else {
                setPlaylists([...playlists, updatedPlaylist]);
              }
              setShowPlaylistForm(false);
              setSelectedPlaylist(null);
            }}
            onCancel={() => setShowPlaylistForm(false)}
          />
        )}

        {/* Lista de Playlists */}
        <ul className="space-y-2">
          {playlists.length === 0 ? (
            <p className="text-gray-500">No hay playlists disponibles.</p>
          ) : (
            playlists.map((playlist) => (
              <li
                key={playlist.id}
                className={`cursor-pointer p-2 rounded-md font-bold text-black ${selectedPlaylist?.id === playlist.id ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                onClick={() => handleSelectPlaylist(playlist)}
              >
                {playlist.name}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Sección de Videos */}
      <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md">
        {selectedPlaylist ? (
          <>
            <h2 className="text-xl font-bold mb-2 text-black">{selectedPlaylist.name}</h2>
            <p className="text-gray-600 mb-4">Total de videos: {videos.length}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video.id} className="p-2 border rounded-lg shadow-sm bg-gray-50">
                    <h3 className="font-bold text-sm text-black">{video.name}</h3>
                    <iframe
                      width="100%"
                      height="150"
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                    <p className="text-xs text-gray-600">{video.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Esta playlist no tiene videos aún.</p>
              )}
            </div>

            {showVideoForm && (
              <VideoForm
                playlistId={selectedPlaylist.id}
                onSave={handleSaveVideo}
                onCancel={handleCancelVideoForm}
              />
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">Selecciona una playlist para ver sus videos.</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;
