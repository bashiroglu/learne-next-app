"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import VideoTranscript, {
  VideoTranscriptRef,
} from "@/components/VideoTranscript";
import type { TranscriptLine } from "@/types/listening";

interface GrammarVideoPlayerProps {
  videoId: string;
  transcript: TranscriptLine[] | null;
}

export interface GrammarVideoPlayerHandle {
  seekToAndPlay: (time: number) => void;
}

export const GrammarVideoPlayer = forwardRef<GrammarVideoPlayerHandle, GrammarVideoPlayerProps>(
  function GrammarVideoPlayer({ videoId, transcript }, ref) {
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
