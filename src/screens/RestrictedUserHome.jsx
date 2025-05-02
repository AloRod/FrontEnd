import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import TitleLayout from '../layout/TitleLayout';
import VideoLayout from '../layout/VideoLayout';
import PlaylistLayout from '../layout/PlaylistLayout';
import GraphQLClient from '../utils/GraphQLClient';
import { useParams } from 'react-router-dom';

const RestrictedUserHome = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    useEffect(() => {
        fetchPlaylistsAndUsers();
    }, []);

    const fetchPlaylistsAndUsers = async () => {
        try {


            setLoading(true);
            const query = `
          {
            profilePlaylists (profileId: ${userId}) {
                id
                name
                videos_count
            }
          }
        `;

            const data = await GraphQLClient.query(query);

            if (data && data.profilePlaylists) {
                setPlaylists(data.profilePlaylists);
            }

            setError(null);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError('There was an error loading the playlists.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) return;
        
        setIsSearching(true);
        setLoading(true);
        
        try {
            const searchQuery = `
                {
                    searchVideos(query: "${query}", restricted_user_id: "${userId}") {
                        id
                        name
                        url
                        description
                    }
                }
            `;
            
            const result = await GraphQLClient.query(searchQuery);
            
            if (result && result.searchVideos) {
                setSearchResults(result.searchVideos);
            } else {
                setSearchResults([]);
            }
            
            setError(null);
        } catch (error) {
            console.error("Error searching videos:", error);
            setError("Failed to search videos. Please try again.");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setIsSearching(false);
        setSearchResults(null);
    };

    return (
        <TitleLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Videos</h2>
                <SearchBar onSearch={handleSearch} />

                {isSearching ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Search results</h3>
                            <button
                                onClick={clearSearch}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Back to playlists
                            </button>
                        </div>
                        <VideoLayout videos={searchResults || []} loading={false} error={null} />
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mb-4">My Playlists</h3>
                        <PlaylistLayout
                            playlists={playlists || []}
                            loading={loading}
                            error={error}
                        />
                    </>
                )}
            </div>
        </TitleLayout>
    );
};

export default RestrictedUserHome;