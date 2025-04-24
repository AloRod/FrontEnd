import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaylistForm from "./PlaylistForm";
import VideoForm from "./VideoForm";

const API_URL = "http://localhost:8000/api";

const VideoList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState({ visible: false, video: null });
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);

  const getToken = () => localStorage.getItem("auth_token");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
        setError("Hubo un error al cargar las listas de reproducción.");
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
        console.error("Error fetching videos:", error);
        setError("Hubo un error al cargar los videos.");
      });
  };

  const handleDeleteVideo = (video) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este video?")) {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
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
          console.error("Error deleting video:", error);
          setError(error.response?.data?.message || "Hubo un error al eliminar el video.");
        });
    }
  };

  const handleSaveVideo = (updatedVideo) => {
    if (!updatedVideo) {
      // If updatedVideo is null, it means the video was deleted
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== showVideoForm.video.id));
    } else if (showVideoForm.video) {
      // Update existing video
      setVideos((prevVideos) =>
        prevVideos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
      );
    } else {
      // Add new video
      setVideos((prevVideos) => [...prevVideos, updatedVideo]);
    }
    setShowVideoForm({ visible: false, video: null });
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 bg-black h-screen w-screen text-white">
      {/* Sidebar for Playlists */}
      <div className="w-full md:w-1/4 bg-gray-900 p-4 rounded-lg shadow-md overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Mis Listas</h1>

        {authError && <p className="text-red-500 mb-4">{authError}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <ul className="space-y-2">
          {playlists.length === 0 ? (
            <p className="text-gray-400">No hay listas disponibles.</p>
          ) : (
            playlists.map((playlist) => (
              <li
                key={playlist.id}
                className={`cursor-pointer p-3 rounded-md font-semibold ${
                  selectedPlaylist?.id === playlist.id ? "bg-blue-900" : "hover:bg-gray-800"
                }`}
                onClick={() => handleSelectPlaylist(playlist)}
              >
                {playlist.name}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Main Content for Videos */}
      <div className="w-full md:w-3/4 bg-gray-900 p-4 rounded-lg shadow-md overflow-auto">
        {showVideoForm.visible && selectedPlaylist ? (
          <VideoForm
            playlistId={selectedPlaylist.id}
            video={showVideoForm.video}
            onSave={handleSaveVideo}
            onCancel={() => setShowVideoForm({ visible: false, video: null })}
          />
        ) : selectedPlaylist ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedPlaylist.name}</h2>
                <p className="text-gray-400">Total videos: {videos.length}</p>
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setShowVideoForm({ visible: true, video: null })}
              >
                Agregar Video
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video.id} className="p-4 border border-gray-800 rounded-lg bg-gray-800">
                    <h3 className="font-bold text-sm mb-2">{video.name}</h3>
                    <div className="aspect-video bg-black rounded">
                      <iframe
                        width="100%"
                        height="100%"
                        src={video.url}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-md"
                      ></iframe>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{video.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
                        onClick={() => setShowVideoForm({ visible: true, video })}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteVideo(video)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-3 text-center py-8">
                  Esta lista no tiene videos todavía. Haz clic en "Agregar Video" para comenzar.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-400 text-center mb-4">
              Selecciona una lista para ver sus videos o crea una nueva lista.
            </p>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              onClick={() => console.log(true)}
            >
              Crear Nueva Lista
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;