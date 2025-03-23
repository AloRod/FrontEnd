import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css';

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('http://localhost:8000/api/playlists/{playlist_id}/videos');
                setVideos(response.data);
            } catch (error) {
                console.error('Error al obtener videos', error);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div className="videos-container">
            <h2>Lista de Videos</h2>
            <button onClick={() => navigate('/VideoForm')}>Agregar Video</button>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>{video.titulo}</li>
                ))}
            </ul>
        </div>
    );
};

export default VideosList;
