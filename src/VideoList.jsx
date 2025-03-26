import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaylistForm from "./PlaylistForm";
import VideoForm from "./VideoForm";

const API_URL = "http://localhost:8000/api";

const VideoList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
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
      setAuthError("You are not authenticated. Please log in.");
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
        setError("There was an error loading the playlists.");
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
        setError("There was an error loading the videos.");
      });
  };

  const handleDeleteVideo = (video) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You are not authenticated. Please log in.");
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
          setError(error.response?.data?.message || "There was an error deleting the video.");
        });
    }
  };

  const handleSaveVideo = (updatedVideo) => {
    if (!updatedVideo) {
      // If updatedVideo is null, it means the video was deleted
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== showVideoForm.video.id));
    } else {
      // If updatedVideo exists, update the state with the new video
      setVideos((prevVideos) =>
        prevVideos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
      );
    }
    setShowVideoForm({ visible: false, video: null });
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 bg-black h-screen w-screen text-white">
      {/* Sidebar for Playlists */}
      <div className="w-full md:w-1/4 bg-gray-900 p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Playlists</h1>

        {authError && <p className="text-red-500 mb-4">{authError}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 flex gap-2">
          {selectedPlaylist && !showVideoForm.visible && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              onClick={() => setShowVideoForm({ visible: true, video: null })}
            >
              Add Video
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
            <p className="text-gray-400">No playlists available.</p>
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
      <div className="w-full md:w-3/4 bg-gray-900 p-4 rounded-lg shadow-md">
        {selectedPlaylist ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedPlaylist.name}</h2>
            <p className="text-gray-400 mb-4">Total videos: {videos.length}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video.id} className="p-4 border border-gray-800 rounded-lg bg-gray-800">
                    <h3 className="font-bold text-sm mb-2">{video.name}</h3>
                    <iframe
                      width="100%"
                      height="150"
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md mt-2"
                    ></iframe>
                    <p className="text-xs text-gray-400 mt-2">{video.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                        onClick={() => setShowVideoForm({ visible: true, video })}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        onClick={() => handleDeleteVideo(video)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">This playlist has no videos yet.</p>
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
          <p className="text-gray-400 text-center">Select a playlist to view its videos.</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;