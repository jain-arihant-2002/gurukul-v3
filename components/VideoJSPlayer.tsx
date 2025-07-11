'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // default styles
import Player from 'video.js/dist/types/player';

interface VideoJSPlayerProps {
  options: {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    sources: {
      src: string;
      type: string; // e.g., 'application/x-mpegURL' for HLS
    }[];
  };
  onReady?: (player: Player) => void;
}

const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered'); 
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        console.log("Player is ready");
        onReady && onReady(player);
      });

      // To make the player look more like YouTube, you can use themes.
      // For now, the default skin is professional enough.
      // Example: player.addClass('vjs-theme-city');

    } else {
      // If the source changes, update the player
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources);
    }
  }, [options, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJSPlayer;