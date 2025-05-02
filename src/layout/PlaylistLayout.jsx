import React from 'react';
import PlaylistCard from '../components/PlaylistCard';

const PlaylistLayout = ({ playlists, loading, error }) => {
  if (loading) return <div className="text-center py-8 text-gray-300">Loading playlists...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading playlists: {error.message}</div>;
  if (!playlists || playlists.length === 0) return <div className="text-center py-8 text-gray-300">No playlists available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map(playlist => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistLayout;