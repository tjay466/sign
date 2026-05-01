import React, { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle, Video as VideoIcon } from "lucide-react";

interface VideoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accentColor?: string;
}

export default function VideoUpload({ onUpload, currentUrl, label, accentColor = "#10b981" }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
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
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      setError("Failed to upload video. Please try again.");
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
      {label && (
        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest block">
          {label}
        </label>
      )}
      
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
                  MP4, WEBM (UP TO 50MB)
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
    </div>
  );
}
