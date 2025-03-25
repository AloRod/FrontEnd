import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [associatedProfiles, setAssociatedProfiles] = useState([]); // Array de IDs de perfiles asociados
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener el token y user_id del localStorage
  const getToken = () => localStorage.getItem('auth_token');
  const getUserId = () => {
    const userId = localStorage.getItem('user_id'); // Leer el user_id del localStorage
    return userId ? parseInt(userId, 10) : null; // Convertir a número
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    axios
      .get(`${API_URL}/playlists`, getAuthHeaders())
      .then((response) => {
        // Convertir associated_profiles de cadenas JSON a arrays
        const playlistsWithParsedProfiles = response.data.map((playlist) => ({
          ...playlist,
          associated_profiles: playlist.associated_profiles
            ? JSON.parse(playlist.associated_profiles)
            : [],
        }));
        setPlaylists(playlistsWithParsedProfiles);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setError('Hubo un error al cargar las playlists.');
      });
  }, []);

  const handleCreateOrUpdatePlaylist = async () => {
    if (!name.trim()) {
      setError('El nombre de la playlist es obligatorio.');
      return;
    }

    setLoading(true);

    try {
      const userId = getUserId(); // Obtener el user_id del localStorage

      if (!userId || isNaN(userId)) {
        throw new Error('No se pudo obtener el ID del usuario o no es válido.');
      }

      // Validar y convertir associated_profiles a números
      const profiles = Array.isArray(associatedProfiles)
        ? associatedProfiles.map(Number).filter((id) => !isNaN(id))
        : [];

      const data = {
        name,
        description,
        user_id: userId, // Usar user_id del localStorage
        admin_id: userId, // Enviar el mismo user_id como admin_id
        associated_profiles: profiles, // Enviar como array vacío si no hay perfiles asociados
      };

      let response;
      if (editingPlaylistId) {
        // Editar playlist existente
        response = await axios.put(
          `${API_URL}/playlists/${editingPlaylistId}`,
          data,
          getAuthHeaders()
        );
      } else {
        // Crear nueva playlist
        response = await axios.post(`${API_URL}/playlists`, data, getAuthHeaders());
      }

      // Actualizar la lista de playlists
      setPlaylists(
        editingPlaylistId
          ? playlists.map((p) => (p.id === editingPlaylistId ? response.data : p))
          : [...playlists, response.data]
      );

      // Limpiar el formulario
      setName('');
      setDescription('');
      setAssociatedProfiles([]);
      setEditingPlaylistId(null);
      setError(null);
    } catch (error) {
      console.error('Error saving playlist:', error);

      // Mostrar errores específicos del backend si están disponibles
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        setError(errors.join(', '));
      } else {
        setError(error.message || 'Hubo un error al guardar la playlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta playlist?')) {
      setLoading(true);

      try {
        await axios.delete(`${API_URL}/playlists/${playlistId}`, getAuthHeaders());
        setPlaylists(playlists.filter((p) => p.id !== playlistId));
        setError(null);
      } catch (error) {
        console.error('Error deleting playlist:', error);
        setError(error.response?.data?.message || 'Hubo un error al eliminar la playlist.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPlaylist = (playlist) => {
    setName(playlist.name);
    setDescription(playlist.description);
    setAssociatedProfiles(playlist.associated_profiles || []); // Cargar perfiles asociados
    setEditingPlaylistId(playlist.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Gestionar Playlists</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulario para Crear/Editar Playlists */}
      <form onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdatePlaylist(); }} className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-black">
          {editingPlaylistId ? 'Editar Playlist' : 'Crear Nueva Playlist'}
        </h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Nombre de la Playlist</label>
          <input
            type="text"
            placeholder="Nombre de la playlist"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            IDs de Perfiles Asociados (separados por comas)
          </label>
          <input
            type="text"
            placeholder="Ejemplo: 1,2,3"
            value={associatedProfiles.join(',')}
            onChange={(e) =>
              setAssociatedProfiles(e.target.value.split(',').map((id) => id.trim()))
            }
            className="border p-2 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : editingPlaylistId ? 'Actualizar Playlist' : 'Crear Playlist'}
          </button>
          {editingPlaylistId && (
            <button
              type="button"
              onClick={() => {
                setName('');
                setDescription('');
                setAssociatedProfiles([]);
                setEditingPlaylistId(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de Playlists */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-black">Tus Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-500">No hay playlists disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                <div>
                  <h3 className="font-bold text-black">{playlist.name}</h3>
                  <p className="text-xs text-gray-600">{playlist.description}</p>
                  <p className="text-xs text-gray-500">
                    Perfiles Asociados:{' '}
                    {Array.isArray(playlist.associated_profiles)
                      ? playlist.associated_profiles.join(', ') || 'Ninguno'
                      : 'Ninguno'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEditPlaylist(playlist)}
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
