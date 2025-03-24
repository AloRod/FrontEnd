import React from 'react';

const PlaylistList = ({ playlists, onSelectPlaylist, onDeletePlaylist }) => {
  // Obtener el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');  // Asegúrate de que el token se haya guardado previamente

  // Función para eliminar playlist con autenticación
  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Incluir el token en los headers
        }
      });

      if (response.ok) {
        onDeletePlaylist(playlistId);  // Llamar la función de callback si la eliminación fue exitosa
      } else {
        console.error('Error al eliminar la playlist');
      }
    } catch (error) {
      console.error('Hubo un error al intentar eliminar la playlist:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id} className="flex justify-between items-center mb-2">
            <span
              className="cursor-pointer text-indigo-600 hover:underline"
              onClick={() => onSelectPlaylist(playlist)}
            >
              {playlist.name}
            </span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeletePlaylist(playlist.id)}  // Usar la nueva función para eliminar
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistList;
