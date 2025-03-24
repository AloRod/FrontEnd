import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Reemplaza con la URL de tu backend

const VideoForm = ({ playlistId, onSave, onCancel, video }) => {
  const [name, setName] = useState(video ? video.name : ''); // Estado para el nombre del video
  const [url, setUrl] = useState(video ? video.url : ''); // Estado para la URL del video
  const [description, setDescription] = useState(video ? video.description : ''); // Estado para la descripción del video
  const [userId, setUserId] = useState(null); // Estado para el ID del usuario
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado para los errores

  // Validación de URL de YouTube o embed de YouTube
  const isValidYouTubeUrl = (url) => {
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    const youtubeEmbedRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/;
    return youtubeUrlRegex.test(url) || youtubeEmbedRegex.test(url);
  };

  // Efecto para cargar el userId desde el localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id'); // Asegúrate de que el user_id esté almacenado en localStorage
    if (storedUserId) {
      setUserId(storedUserId); // Establecemos el userId si está presente
    } else {
      setError('Usuario no autenticado'); // Si no hay userId, mostramos un error
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores
    setLoading(true); // Activar estado de carga

    // Validaciones básicas
    if (!name.trim()) {
      setError('El nombre del video es obligatorio.');
      setLoading(false);
      return;
    }
    if (!url.trim() || !isValidYouTubeUrl(url)) {
      setError('Por favor, ingresa una URL válida de YouTube o un enlace embebido.');
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem('user_id'); // Recuperamos el user_id del localStorage
    if (!userId) {
      setError('No se encontró el ID del usuario.');
      setLoading(false);
      return;
    }

    // Asegurarse de que userId sea un número (convertirlo a tipo bigint)
    const userIdNumber = Number(userId); // Convierte a número (bigint)
    if (isNaN(userIdNumber)) {
      setError('El ID de usuario no es válido.');
      setLoading(false);
      return;
    }

    const data = { name, url, description, user_id: userIdNumber }; // Asegúrate de enviar el número

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    // Si hay un video, significa que estamos en el modo de actualización
    if (video) {
      // Actualizamos el video
      axios.put(`${API_URL}/playlists/${playlistId}/videos/${video.id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          onSave(response.data); // Notificar al componente padre que se actualizó el video
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error updating video:', error);
          setError(
            error.response?.data?.message ||
            'Hubo un error al actualizar el video. Por favor, intenta nuevamente.'
          );
          setLoading(false);
        });
    } else {
      // Si no hay video, estamos creando un nuevo video
      axios.post(`${API_URL}/playlists/${playlistId}/videos`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          onSave(response.data); // Notificar al componente padre que se creó el video
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error creating video:', error);
          setError(
            error.response?.data?.message ||
            'Hubo un error al crear el video. Por favor, intenta nuevamente.'
          );
          setLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (video) {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      axios.delete(`${API_URL}/playlists/${playlistId}/videos/${video.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          onSave(null); // Notificar al componente padre que el video fue eliminado
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting video:', error);
          setError(
            error.response?.data?.message ||
            'Hubo un error al eliminar el video. Por favor, intenta nuevamente.'
          );
          setLoading(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Mensaje de error */}
      {error && <p className="text-red-500 mb-2 text-black">{error}</p>}

      {/* Campo de Nombre */}
      <input
        type="text"
        placeholder="Nombre del video"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 w-full mb-2 text-black"
      />

      {/* Campo de URL */}
      <input
        type="url"
        placeholder="URL del video (YouTube o embebido)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="border p-2 w-full mb-2 text-black"
      />

      {/* Campo de Descripción */}
      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2 text-black"
      />

      {/* Botones de Acción */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Guardando...' : (video ? 'Actualizar Video' : 'Agregar Video')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancelar
        </button>
        {/* Si es un video existente, mostrar el botón de eliminar */}
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
