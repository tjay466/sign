import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Check, AlertCircle, Video as VideoIcon, Search, FileVideo } from "lucide-react";

interface VideoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accentColor?: string;
}

interface ExistingVideo {
  name: string;
  url: string;
}

export default function VideoUpload({ onUpload, currentUrl, label, accentColor = "#10b981" }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [existingVideos, setExistingVideos] = useState<ExistingVideo[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setExistingVideos(data);
      }
    } catch (err) {
      console.error("Failed to fetch video library:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (showLibrary) {
      fetchLibrary();
    }
  }, [showLibrary]);

  const handleUpload = async (file: File) => {
    // Basic check for file extension if mimetype is missing or generic
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
    
    if (!isVideo) {
      setError("Please upload a video file (MP4, WEBM, OGG, or MOV)");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      onUpload(data.url);
      setShowLibrary(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[10px] font-black opacity-30 uppercase tracking-widest block">
            {label}
          </label>
        )}
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity"
        >
          <Search className="w-2.5 h-2.5" />
          {showLibrary ? "Upload New" : "Browse Existing"}
        </button>
      </div>
      
      {showLibrary ? (
        <div className="bg-black/40 border border-white/10 rounded-md overflow-hidden flex flex-col max-h-48">
          <div className="p-2 border-b border-white/10 text-[9px] font-black uppercase tracking-widest opacity-30">
            Available Videos on Server
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {isLoadingLibrary ? (
              <div className="p-4 flex justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : existingVideos.length === 0 ? (
              <div className="p-6 text-center text-[10px] opacity-20 font-bold uppercase tracking-widest">
                No videos found in folder
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {existingVideos.map((video) => (
                  <button
                    key={video.url}
                    onClick={() => {
                      onUpload(video.url);
                      setShowLibrary(false);
                    }}
                    className={`w-full p-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group ${
                      currentUrl === video.url ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="w-8 h-8 bg-black/40 rounded flex items-center justify-center flex-shrink-0">
                      <FileVideo className={`w-4 h-4 ${currentUrl === video.url ? "text-emerald-500" : "opacity-30"}`} />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-[11px] font-bold text-white/80 group-hover:text-white truncate">
                        {video.name}
                      </div>
                      <div className="text-[8px] opacity-30 font-black uppercase truncate">
                        {video.url}
                      </div>
                    </div>
                    {currentUrl === video.url && (
                      <Check className="w-3 h-3 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div 
          className={`relative border-2 border-dashed transition-all p-4 ${
            dragActive ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/10 bg-black/20 hover:border-white/20"
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <div className="flex items-center gap-4">
            {currentUrl ? (
              <div className="relative w-16 h-16 bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0 group flex items-center justify-center">
                 <VideoIcon className="w-6 h-6 text-white opacity-40" />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none text-[8px] font-black uppercase text-center p-1">
                   Video Loaded
                 </div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                <VideoIcon className="w-6 h-6 opacity-20" />
              </div>
            )}

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
              
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Uploading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-100 opacity-60 flex items-center gap-2"
                    style={{ color: accentColor }}
                  >
                    <Upload className="w-3 h-3" />
                    Upload Video
                  </button>
                  <p className="text-[9px] opacity-30 font-bold uppercase tracking-widest">
                    MP4, WEBM, MOV (UP TO 250MB)
                  </p>
                </div>
              )}
            </div>

            {currentUrl && !isUploading && (
              <div className="text-emerald-500">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
