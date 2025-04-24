import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 

const VideoForm = ({ playlistId, onSave, onCancel, video }) => {
  const [name, setName] = useState(video ? video.name : '');
  const [url, setUrl] = useState(video ? video.url : '');
  const [description, setDescription] = useState(video ? video.description : '');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // YouTube search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('Unauthenticated user');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError('The name of the video is required.');
      setLoading(false);
      return;
    }

    const data = { name, url, description, user_id: userId };

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('You are not authenticated. Please log in.');
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
          setError(error.response?.data?.message || 'There was an error updating the video.');
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
          setError(error.response?.data?.message || 'There was an error creating the video.');
          setLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setLoading(true);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
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
          setError(error.response?.data?.message || 'There was an error deleting the video.');
          setLoading(false);
        });
    }
  };

  // Function to search YouTube videos
  const searchYouTube = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            maxResults: 5,
            q: searchQuery,
            type: 'video',
            key: YOUTUBE_API_KEY
          }
        }
      );
      
      setSearchResults(response.data.items);
      setShowSearchResults(true);
      setSearching(false);
    } catch (error) {
      console.error('Error searching YouTube:', error);
      setError('Error searching for videos on YouTube. Please try again.');
      setSearching(false);
    }
  };

  // Function to select a video from search results
  const selectVideo = (video) => {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const videoDesc = video.snippet.description;
    
    setName(videoTitle);
    setUrl(`https://www.youtube.com/embed/${videoId}`);
    setDescription(videoDesc);
    setShowSearchResults(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white mb-6">
      <h3 className="text-xl font-bold mb-4">
        {video ? 'Edit Video' : 'Add Video'}
      </h3>
      
      {error && <p className="text-red-500 mb-4 p-2 bg-red-900 bg-opacity-20 rounded">{error}</p>}

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-1/2 pr-2">
            <h4 className="font-medium mb-2">Method 1: Direct URL</h4>
            <p className="text-sm text-gray-400 mb-2">
              Add a video by entering its YouTube URL
            </p>
          </div>
          <div className="w-1/2 pl-2">
            <h4 className="font-medium mb-2">Method 2: YouTube Search</h4>
            <p className="text-sm text-gray-400 mb-2">
              Search and select a YouTube video
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="w-1/2 pr-2">
            <div className="relative">
              <input
                type="url"
                placeholder="Video URL (YouTube or embedded)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border border-gray-700 p-2 w-full rounded bg-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="w-1/2 pl-2">
            <form onSubmit={searchYouTube} className="flex">
              <input
                type="text"
                placeholder="Search for videos on YouTube..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-700 p-2 flex-grow rounded-l bg-gray-700 text-white"
              />
              <button
                type="submit"
                disabled={searching}
                className={`bg-red-600 text-white px-4 py-2 rounded-r hover:bg-red-700 ${
                  searching ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* YouTube search results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="mb-6 bg-gray-900 p-4 rounded">
          <h4 className="font-medium mb-2">Search resultsa</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.id.videoId}
                className="flex bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => selectVideo(result)}
              >
                <img
                  src={result.snippet.thumbnails.default.url}
                  alt={result.snippet.title}
                  className="w-20 h-16 object-cover rounded mr-2"
                />
                <div className="flex-1">
                  <h5 className="text-sm font-medium line-clamp-2">{result.snippet.title}</h5>
                  <p className="text-xs text-gray-400 line-clamp-1">{result.snippet.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video form fields */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="video-name" className="block text-sm font-medium text-gray-400 mb-1">
          Name of the video
          </label>
          <input
            id="video-name"
            type="text"
            placeholder="Name of the video"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-700 p-2 w-full rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video-description" className="block text-sm font-medium text-gray-400 mb-1">
            Description (optional)
          </label>
          <textarea
            id="video-description"
            placeholder="Video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="border border-gray-700 p-2 w-full rounded bg-gray-700 text-white"
          />
        </div>

        {/* Preview section */}
        {url && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Preview
            </label>
            <div className="relative pt-[56.25%] w-full bg-black rounded">
              <iframe
                src={url}
                className="absolute top-0 left-0 w-full h-full rounded"
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : video ? 'Update Video' : 'Add Video'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          
          {video && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Video'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VideoForm;