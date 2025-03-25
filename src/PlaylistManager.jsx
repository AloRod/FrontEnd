import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

const PlaylistManager = () => {
  const history = useHistory();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('auth_token');

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    // Cargar todas las playlists
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

  const handleCreatePlaylist = () => {
    if (!name.trim()) {
      setError('El nombre de la playlist es obligatorio.');
      return;
    }

    setLoading(true);

    axios
      .post(`${API_URL}/playlists`, { name, description }, getAuthHeaders())
      .then((response) => {
        setPlaylists([...playlists, response.data]);
        setName('');
        setDescription('');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating playlist:', error);
        setError(error.response?.data?.message || 'Hubo un error al crear la playlist.');
        setLoading(false);
      });
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta playlist?')) {
      setLoading(true);

      axios
        .delete(`${API_URL}/playlists/${playlistId}`, getAuthHeaders())
        .then(() => {
          setPlaylists(playlists.filter((p) => p.id !== playlistId));
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting playlist:', error);
          setError(error.response?.data?.message || 'Hubo un error al eliminar la playlist.');
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Gestionar Playlists</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulario para crear una nueva playlist */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-black">Crear Nueva Playlist</h2>
        <input
          type="text"
          placeholder="Nombre de la playlist"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full mb-2 text-black"
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2 text-black"
        />
        <button
          onClick={handleCreatePlaylist}
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creando...' : 'Crear Playlist'}
        </button>
      </div>

      {/* Lista de Playlists */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-black">Tus Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-500">No hay playlists disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                <div>
                  <h3 className="font-bold text-black">{playlist.name}</h3>
                  <p className="text-xs text-gray-600">{playlist.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => history.push(`/playlists/edit/${playlist.id}`)} // Redirige a la página de edición
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;