import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const VideoForm = ({ playlistId, onSave, onCancel, video }) => {
  const [name, setName] = useState(video ? video.name : '');
  const [url, setUrl] = useState(video ? video.url : '');
  const [description, setDescription] = useState(video ? video.description : '');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('Usuario no autenticado');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError('El nombre del video es obligatorio.');
      setLoading(false);
      return;
    }

    const data = { name, url, description, user_id: userId };

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    if (video) {
      axios
        .put(`${API_URL}/playlists/${playlistId}/videos/${video.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          onSave(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error updating video:', error);
          setError(error.response?.data?.message || 'Hubo un error al actualizar el video.');
          setLoading(false);
        });
    } else {
      axios
        .post(`${API_URL}/playlists/${playlistId}/videos`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          onSave(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error creating video:', error);
          setError(error.response?.data?.message || 'Hubo un error al crear el video.');
          setLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
      setLoading(true);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      axios
        .delete(`${API_URL}/playlists/${playlistId}/videos/${video.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          onSave(null);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting video:', error);
          setError(error.response?.data?.message || 'Hubo un error al eliminar el video.');
          setLoading(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Nombre del video"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 w-full mb-2 text-black"
      />

      <input
        type="url"
        placeholder="URL del video (YouTube o embebido)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="border p-2 w-full mb-2 text-black"
      />

      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2 text-black"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Guardando...' : video ? 'Actualizar Video' : 'Agregar Video'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancelar
        </button>
        {video && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar Video'}
          </button>
        )}
      </div>
    </form>
  );
};

export default VideoForm;