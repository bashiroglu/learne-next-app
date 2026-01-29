"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useWritingPractice } from "@/contexts/WritingPracticeContext";
import { Button } from "@/components/ui/button";
import { Upload, ZoomIn, ZoomOut, RotateCcw, X, Image as ImageIcon, Move } from "lucide-react";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function ImagePanel() {
  const { task1Images, addTask1Image, removeTask1Image } = useWritingPractice();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Image transform state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset transform when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedImageIndex, task1Images.length]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addTask1Image(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [addTask1Image]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    Array.from(items).forEach((item) => {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              addTask1Image(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }, [addTask1Image]);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (task1Images.length === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (task1Images.length === 0) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM));
  };

  const currentImage = task1Images[selectedImageIndex];

  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Task 1 Image</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8"
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image area */}
      <div className="flex-1 relative overflow-hidden">
        {task1Images.length === 0 ? (
          <div
            className="image-panel-dropzone h-full m-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Upload an image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to browse or paste from clipboard
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="h-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            <div
              className="w-full h-full flex items-center justify-center p-4"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt="Task 1 reference"
                className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                draggable={false}
              />
            </div>

            {/* Image controls */}
            <div className="image-panel-controls">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleResetZoom}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeTask1Image(selectedImageIndex)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Drag hint */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
              <Move className="w-3 h-3" />
              Drag to pan
            </div>
          </div>
        )}
      </div>

      {/* Image thumbnails (if multiple) */}
      {task1Images.length > 1 && (
        <div className="panel-footer flex gap-2 overflow-x-auto">
          {task1Images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
