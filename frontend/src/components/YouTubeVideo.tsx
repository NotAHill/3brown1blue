
import React from "react";

export interface YouTubeVideoProps {
  videoId: string;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId }) => (
  <div className="w-full mt-4 flex justify-center">
    <div className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="3Blue1Brown Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  </div>
);

export default YouTubeVideo;
