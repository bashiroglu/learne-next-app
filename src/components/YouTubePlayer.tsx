"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";

interface YouTubePlayer {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
  getDuration: () => number;
  getPlaybackRate: () => number;
  playVideo: () => void;
  getPlayerState: () => number;
}

interface YouTubePlayerEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubePlayerProps {
  videoId: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  onDurationChange?: (duration: number) => void;
}

export interface YouTubePlayerRef {
  getCurrentTime: () => number;
  seekTo: (seconds: number) => void;
  getPlaybackRate: () => number;
  seekToAndPlay: (seconds: number) => void;
}

const PLAYER_STATE_PLAYING = 1;
const PLAYER_STATE_BUFFERING = 3;

const YouTubePlayerComponent = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, onTimeUpdate, onPlayingChange, onDurationChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [, setIsReady] = useState(false);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0;
      },
      seekTo: (seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
      },
      getPlaybackRate: () => {
        return playerRef.current?.getPlaybackRate() || 1;
      },
      seekToAndPlay: (seconds: number) => {
        if (playerRef.current) {
          playerRef.current.seekTo(seconds, true);
          const state = playerRef.current.getPlayerState();
          if (state !== PLAYER_STATE_PLAYING && state !== PLAYER_STATE_BUFFERING) {
            playerRef.current.playVideo();
          }
        }
      },
    }));

    const handleStateChange = useCallback(
      (event: YouTubePlayerEvent) => {
        if (event.data === PLAYER_STATE_PLAYING) {
          onPlayingChange?.(true);
          intervalRef.current = setInterval(() => {
            if (playerRef.current && onTimeUpdate) {
              const currentTime = playerRef.current.getCurrentTime();
              onTimeUpdate(currentTime);
            }
          }, 100);
        } else {
          onPlayingChange?.(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      [onTimeUpdate, onPlayingChange]
    );

    useEffect(() => {
      const initializePlayer = () => {
        if (!containerRef.current) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const YT = (window as any).YT;

        playerRef.current = new YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            cc_load_policy: 0,
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              setIsReady(true);
              const duration = event.target.getDuration();
              onDurationChange?.(duration);
            },
            onStateChange: handleStateChange,
          },
        });
      };

      const loadYouTubeAPI = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).YT && (window as any).YT.Player) {
          initializePlayer();
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).onYouTubeIframeAPIReady = initializePlayer;
      };

      loadYouTubeAPI();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }, [videoId, handleStateChange, onDurationChange]);

    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-card border border-border p-0">
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:block"
        />
      </div>
    );
  }
);

YouTubePlayerComponent.displayName = "YouTubePlayer";

export default YouTubePlayerComponent;
