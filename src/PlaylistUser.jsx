import React from "react";
import { useLocation } from "react-router-dom";

const PlaylistUser = () => {
    const location = useLocation();
    const playlists = location.state?.playlists || []; // Obtener las playlists del estado

    return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white mb-8">Your Playlists</h1>
            <ul className="space-y-4">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <li key={playlist.id} className="text-lg text-white">
                            {playlist.name}
                        </li>
                    ))
                ) : (
                    <p className="text-white">No playlists available.</p>
                )}
            </ul>
        </div>
    );
};

export default PlaylistUser;