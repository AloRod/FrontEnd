import React from 'react';
import VideoCard from '../components/VideoCard';

const VideoLayout = ({ videos, loading, error }) => {
  if (loading) return <div className="text-center py-8 text-gray-300">Loading videos...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading videos: {error.message}</div>;
  if (!videos || videos.length === 0) return <div className="text-center py-8 text-gray-300">No videos available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoLayout;