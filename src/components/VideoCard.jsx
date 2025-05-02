import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div key={video.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={video.url} 
                title={video.name}
                className="w-full h-64" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-white">{video.name}</h3>
              <p className="text-gray-400">{video.description}</p>
            </div>
          </div>
  );
};

export default VideoCard;