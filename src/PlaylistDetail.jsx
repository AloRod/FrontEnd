import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const PlaylistDetail = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playlistId } = useParams();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Not authenticated, please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/playlists/${playlistId}/videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) { // Corregido: === en lugar de =
          setVideos(response.data);
        }
      } catch (err) {
        setError(`Error fetching playlist videos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  if (loading) return <div className="text-center py-10">Cargando videos...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (videos.length === 0) return <div className="text-center py-10">No hay videos en esta playlist</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Videos en esta playlist</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={video.url} 
                title={video.name}
                className="w-full h-64" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{video.name}</h3>
              <p className="text-gray-600">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;