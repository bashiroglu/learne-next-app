"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import VideoTranscript, {
  VideoTranscriptRef,
} from "@/components/VideoTranscript";
import type { TranscriptLine } from "@/types/listening";

interface VideoPlayerProps {
  videoId: string;
  transcript: TranscriptLine[] | null;
}

export interface VideoPlayerHandle {
  seekToAndPlay: (time: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ videoId, transcript }, ref) {
    const videoRef = useRef<VideoTranscriptRef>(null);

    useImperativeHandle(ref, () => ({
      seekToAndPlay: (time: number) => {
        videoRef.current?.seekToAndPlay(time);
      },
    }));

    return (
      <VideoTranscript
        ref={videoRef}
        videoId={videoId}
        transcriptData={transcript}
      />
    );
  }
);
