import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Reemplaza con la URL de tu backend

const PlaylistForm = ({ playlist, onSave, onCancel }) => {
  const [name, setName] = useState(playlist?.name || '');
  const [adminId, setAdminId] = useState(playlist?.admin_id || ''); // ID del administrador
  const [associatedProfiles, setAssociatedProfiles] = useState(playlist?.associated_profiles || []); // IDs de perfiles asociados
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');  // Asegúrate de que el token se haya guardado previamente

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Validar que los campos obligatorios no estén vacíos
    if (!name.trim()) {
      setError('El nombre de la playlist es obligatorio.');
      return;
    }
    if (!adminId || isNaN(adminId)) {
      setError('El ID del administrador es obligatorio y debe ser un número válido.');
      return;
    }

    try {
      const data = {
        name,
        admin_id: Number(adminId), // Convertir a número
        associated_profiles: Array.isArray(associatedProfiles)
          ? associatedProfiles.map(Number) // Convertir IDs a números
          : [],
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en los headers
          'Content-Type': 'application/json',
        },
      };

      if (playlist) {
        // Editar playlist existente
        const response = await axios.put(`${API_URL}/playlists/${playlist.id}`, data, config);
        onSave(response.data); // Notificar al componente padre
      } else {
        // Crear nueva playlist
        const response = await axios.post(`${API_URL}/playlists`, data, config);
        onSave(response.data); // Notificar al componente padre
      }
    } catch (error) {
      console.error('Error al guardar la playlist:', error);
      setError('Hubo un error al guardar la playlist. Por favor, intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Campo para el nombre de la playlist */}
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

      {/* Campo para el ID del administrador */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">ID del Administrador</label>
        <input
          type="number"
          placeholder="ID del administrador"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      {/* Campo para los perfiles asociados */}
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

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          {playlist ? 'Actualizar' : 'Crear'} Playlist
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default PlaylistForm;
