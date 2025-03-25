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
  const [showVideoForm, setShowVideoForm] = useState({ visible: false, video: null });
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);

  const getToken = () => localStorage.getItem('auth_token');

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setError('Hubo un error al cargar las playlists.');
      });
  }, []);

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);

    axios
      .get(`${API_URL}/playlists/${playlist.id}/videos`, getAuthHeaders())
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setError('Hubo un error al cargar los videos.');
      });
  };

  const handleDeleteVideo = (video) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        return;
      }

      axios
        .delete(`${API_URL}/playlists/${selectedPlaylist.id}/videos/${video.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setVideos((prevVideos) => prevVideos.filter((v) => v.id !== video.id));
        })
        .catch((error) => {
          console.error('Error deleting video:', error);
          setError(error.response?.data?.message || 'Hubo un error al eliminar el video.');
        });
    }
  };

  const handleSaveVideo = (updatedVideo) => {
    if (!updatedVideo) {
      // Si updatedVideo es null, significa que se eliminó el video
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== showVideoForm.video.id));
    } else {
      // Si updatedVideo existe, actualiza el estado con el nuevo video
      setVideos((prevVideos) =>
        prevVideos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
      );
    }
    setShowVideoForm({ visible: false, video: null });
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Mis Playlists</h1>

        {authError && <p className="text-red-500 mb-4">{authError}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 flex gap-2">
          {selectedPlaylist && !showVideoForm.visible && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowVideoForm({ visible: true, video: null })}
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

        <ul className="space-y-2">
          {playlists.length === 0 ? (
            <p className="text-gray-500">No hay playlists disponibles.</p>
          ) : (
            playlists.map((playlist) => (
              <li
                key={playlist.id}
                className={`cursor-pointer p-2 rounded-md font-bold text-black ${
                  selectedPlaylist?.id === playlist.id ? 'bg-blue-200' : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSelectPlaylist(playlist)}
              >
                {playlist.name}
              </li>
            ))
          )}
        </ul>
      </div>

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
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => setShowVideoForm({ visible: true, video })}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteVideo(video)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Esta playlist no tiene videos aún.</p>
              )}
            </div>

            {showVideoForm.visible && (
              <VideoForm
                playlistId={selectedPlaylist.id}
                video={showVideoForm.video}
                onSave={handleSaveVideo}
                onCancel={() => setShowVideoForm({ visible: false, video: null })}
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