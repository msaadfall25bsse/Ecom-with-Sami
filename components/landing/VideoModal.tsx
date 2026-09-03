'use client';

import React from 'react';
import { X, Play } from 'lucide-react';

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title 
}: VideoModalProps) {
  if (!isOpen) return null;

  const url = videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

  const isDirectVideo = Boolean(
    url.startsWith('/uploads/') ||
    url.startsWith('http://localhost:5000/uploads/') ||
    url.startsWith('blob:') ||
    /\.(mp4|webm|mov|mkv|ogg|m4v)($|\?)/i.test(url)
  );

  let embedUrl = url;
  if (!isDirectVideo) {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl border border-slate-700/80 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950 text-white">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 truncate pr-2">
            <Play size={16} className="text-[#00A0DF] fill-[#00A0DF] flex-shrink-0" />
            <span className="truncate">{title || 'Video Player'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="Close Video Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 16:9 Responsive Video Aspect Box */}
        <div className="relative w-full aspect-video bg-black">
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay={false}
              preload="metadata"
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              title={title || "Video Player"}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
