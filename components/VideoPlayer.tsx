// In: components/SecureVideoPlayer.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import Player from '@mux/mux-player-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface SecureVideoPlayerProps {
  lectureId: string;
}

export default function SecureVideoPlayer({ lectureId }: SecureVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track the current lectureId for the fetch operation
  // This prevents race conditions if the user quickly navigates between lectures
  const lectureIdRef = useRef(lectureId);
  lectureIdRef.current = lectureId;

  useEffect(() => {
    // Reset state whenever the lectureId changes
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    const fetchVideoUrl = async () => {
      try {
        const response = await fetch('/api/videos/get-cloudinary-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lectureId }),
        });

        const data = await response.json();

        // Only update state if the response corresponds to the current lectureId
        if (lectureIdRef.current === lectureId) {
          if (!response.ok) {
            throw new Error(data.message || 'Failed to load video.');
          }
          setVideoUrl(data.signedUrl);
        }

      } catch (err: any) {
        if (lectureIdRef.current === lectureId) {
          setError(err.message || "An unknown error occurred.");
        }
      } finally {
        if (lectureIdRef.current === lectureId) {
          setIsLoading(false);
        }
      }
    };

    fetchVideoUrl();
  }, [lectureId]);

  if (isLoading) {
    return (
      <div className="w-full aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h3 className="text-lg font-semibold">Could not load video</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (videoUrl) {
    return (
      <Player
        src={videoUrl}
        autoPlay
        className="w-full aspect-video"
      />
    );
  }

  return null; // Fallback, should not be reached in normal flow
}