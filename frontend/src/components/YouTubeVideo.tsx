import React from "react";

export interface YouTubeVideoProps {
  videoId: string;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId }) => {
  // Check if it's a local video file
  const isLocalVideo =
    !videoId.includes("youtube.com") && !videoId.includes("youtu.be");

  if (isLocalVideo) {
    return (
      <div className="w-full mt-4 flex justify-center">
        <div className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            className="w-full h-full"
            controls
            src={`/media/${videoId}.mp4`}
            title="3Blue1Brown Style Video"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  return (
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
};

export default YouTubeVideo;
