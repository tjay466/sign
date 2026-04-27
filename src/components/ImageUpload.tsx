import React, { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accentColor?: string;
}

export default function ImageUpload({ onUpload, currentUrl, label, accentColor = "#10b981" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
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
            <div className="relative w-16 h-16 bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0 group">
              <img 
                src={currentUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 opacity-20" />
            </div>
          )}

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
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
                  Click to Upload
                </button>
                <p className="text-[9px] opacity-30 font-bold uppercase tracking-widest">
                  or drag and drop image here
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
