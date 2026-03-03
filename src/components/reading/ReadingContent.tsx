"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Maximize, Minimize } from "lucide-react";

interface ReadingContentProps {
  title: string;
  content: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
}

export const ReadingContent = ({
  title,
  content,
  className = "",
  children,
  overlay,
}: ReadingContentProps) => {
  const [fontSize, setFontSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.75);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const lineHeightOptions = [1.6, 1.75, 1.9];

  useEffect(() => {
    // Set initial font size based on window width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize(18);
      } else {
        setFontSize(19);
      }
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);

    // Listen for Esc key to exit full screen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 16));
  };

  const toggleLineHeight = () => {
    const currentIndex = lineHeightOptions.indexOf(lineHeight);
    const nextIndex = (currentIndex + 1) % lineHeightOptions.length;
    setLineHeight(lineHeightOptions[nextIndex]);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Wrapper class for full screen mode
  const containerClass = isFullScreen
    ? "fixed inset-0 z-50 bg-background overflow-y-auto px-4 py-8 flex flex-col items-center"
    : `w-full ${className}`;

  // Adjust card width/class in full screen
  const cardStyle = isFullScreen
    ? { maxWidth: "800px", width: "100%", borderRadius: "14px", marginBottom: "2rem" }
    : { maxWidth: "680px", borderRadius: "14px" };

  return (
    <div className={containerClass}>
      {/* Controls */}
      <div
        className={`flex items-center justify-center gap-3 mb-4 ${
          isFullScreen
            ? "sticky top-0 z-10 py-2 bg-background/80 backdrop-blur-sm px-4 rounded-full"
            : ""
        }`}
      >
        <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            disabled={fontSize <= 16}
            className="h-8 px-3"
          >
            <Minus className="w-4 h-4 mr-1" />
            A-
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            disabled={fontSize >= 24}
            className="h-8 px-3"
          >
            A+
            <Plus className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLineHeight}
          className="h-8 bg-card"
        >
          Line: {lineHeight}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullScreen}
          className="h-8 bg-card px-3"
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullScreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Reading Card */}
      <Card
        className="mx-auto bg-card border border-border shadow-sm relative overflow-hidden shrink-0"
        style={cardStyle}
      >
        <div
          className="px-6 py-6 md:px-8 md:py-8"
          style={{
            fontFamily: "Quicksand, sans-serif",
          }}
        >
          {/* Title */}
          <h2
            className="mb-6"
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: `${fontSize + 6}px`,
              fontWeight: 600,
              letterSpacing: "0.2px",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>

          {/* Content */}
          <div
            className="reading-content text-foreground"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              lineHeight: lineHeight,
              letterSpacing: "0.2px",
            }}
          >
            {typeof content === "string" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: content
                    .split("\n\n")
                    .map((para) => {
                      // Parse markdown-style bold (**text**) and italic (*text*)
                      const formatted = para
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.+?)\*/g, "<em>$1</em>");
                      return `<p style="margin-bottom: 1.2em;">${formatted}</p>`;
                    })
                    .join(""),
                }}
              />
            ) : (
              content
            )}
          </div>

          {/* Footer Children (Buttons etc) */}
          {children && <div className="mt-8">{children}</div>}
        </div>

        {/* Overlay */}
        {overlay}
      </Card>
    </div>
  );
};
