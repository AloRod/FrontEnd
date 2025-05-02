import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist.id}`} className="block">
      <div className="bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-blue-400 mb-2">{playlist.name}</h3>
        <div className="flex justify-between text-gray-400">
          <span>{playlist.videos_count} videos</span>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;