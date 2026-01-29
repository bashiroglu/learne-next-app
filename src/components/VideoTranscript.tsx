"use client";

import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import YouTubePlayer, { YouTubePlayerRef } from "@/components/YouTubePlayer";
import TranscriptSection from "@/components/TranscriptSection";

interface JSONTranscriptLine {
  line: number;
  start: string;
  end: string;
  text: string;
}

interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface VideoTranscriptProps {
  videoId: string;
  transcriptData: JSONTranscriptLine[] | null;
  onPlayingChange?: (isPlaying: boolean) => void;
  onDurationChange?: (duration: number) => void;
}

export interface VideoTranscriptRef {
  seekTo: (seconds: number) => void;
  seekToAndPlay: (seconds: number) => void;
  getCurrentTime: () => number;
  getPlaybackRate: () => number;
}

/**
 * Converts a timestamp string in format "HH:MM:SS,mmm" to seconds
 */
const parseTimestamp = (timestamp: string): number => {
  const [time, milliseconds] = timestamp.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const ms = Number(milliseconds) || 0;

  return hours * 3600 + minutes * 60 + seconds + ms / 1000;
};

const VideoTranscript = forwardRef<VideoTranscriptRef, VideoTranscriptProps>(
  ({ videoId, transcriptData, onPlayingChange, onDurationChange }, ref) => {
    const [currentTime, setCurrentTime] = useState(0);
    const internalPlayerRef = useRef<YouTubePlayerRef>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        internalPlayerRef.current?.seekTo(seconds);
        setCurrentTime(seconds);
      },
      seekToAndPlay: (seconds: number) => {
        internalPlayerRef.current?.seekToAndPlay(seconds);
        setCurrentTime(seconds);
      },
      getCurrentTime: () => internalPlayerRef.current?.getCurrentTime() || 0,
      getPlaybackRate: () => internalPlayerRef.current?.getPlaybackRate() || 1,
    }));

    // Transform JSON transcript data to component format
    const transcript: TranscriptLine[] = (transcriptData || []).map((line) => ({
      id: line.line.toString(),
      startTime: parseTimestamp(line.start),
      endTime: parseTimestamp(line.end),
      text: line.text,
    }));

    const hasTranscript = transcript.length > 0;

    const handleTimeUpdate = useCallback((time: number) => {
      setCurrentTime(time);
    }, []);

    const handleSeek = useCallback((time: number) => {
      internalPlayerRef.current?.seekTo(time);
      setCurrentTime(time);
    }, []);

    return (
      <div className="flex flex-col gap-4 relative">
        {/* Video - with padding for transcript on desktop */}
        <div className={hasTranscript ? "w-full lg:pr-[396px]" : "w-full"}>
          <YouTubePlayer
            ref={internalPlayerRef}
            videoId={videoId}
            onTimeUpdate={handleTimeUpdate}
            onPlayingChange={onPlayingChange}
            onDurationChange={onDurationChange}
          />
        </div>

        {/* Transcript - absolute on desktop */}
        {hasTranscript && (
          <div className="w-full lg:w-[380px] lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:h-auto h-[300px]">
            <TranscriptSection
              transcript={transcript}
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </div>
        )}
      </div>
    );
  }
);

VideoTranscript.displayName = "VideoTranscript";

export default VideoTranscript;
