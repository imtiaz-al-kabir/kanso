'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [...value];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast('Only image files are allowed', 'error');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'japandi_luxury_products');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          uploadedUrls.push(data.url);
          toast(`Uploaded: ${file.name}`, 'success');
        } else {
          toast(data.error || `Upload failed for ${file.name}`, 'error');
        }
      } catch (err) {
        console.error(err);
        toast(`Network error uploading ${file.name}`, 'error');
      }
    }

    setIsUploading(false);
    onChange(uploadedUrls);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 font-sans w-full">
      <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
        Product Showcase Images
      </span>

      {/* Drag & drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          isDragActive
            ? 'border-charcoal bg-charcoal/5 scale-101'
            : 'border-charcoal/10 hover:border-charcoal/30 bg-sand/30 hover:bg-sand/65'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-stone-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-charcoal" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Uploading media files...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-stone-500 text-xs text-center px-4">
            <Upload className="w-5 h-5 text-stone-400" />
            <span className="font-semibold text-charcoal">Drag & Drop or Click to Upload</span>
            <span className="text-[10px] text-stone-400 font-light font-sans">
              Images will automatically optimize & crop using Cloudinary or Local uploads
            </span>
          </div>
        )}
      </div>

      {/* Previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-1">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xs border border-charcoal/5 group shrink-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${url}')` }}
              />
              {/* Remove overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal/80 text-white flex items-center justify-center hover:bg-charcoal transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
