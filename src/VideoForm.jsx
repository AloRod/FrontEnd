import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css';

const VideoForm = () => {
    const [titulo, setTitulo] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/videos', { titulo, url });
            navigate('/videos');
        } catch (err) {
            setError('Error al agregar el video');
        }
    };

    return (
        <div className="form-container">
            <h2>Agregar Video</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Título del video" 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)}
                    required 
                />
                <input 
                    type="url" 
                    placeholder="URL del video" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    required 
                />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default VideoForm;
