import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FileUpload({ onFileSelect, accept = "image/*,video/*", preview = null, onClear }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag and drop or click to upload media
            </p>
          </label>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          {preview.type === 'image' ? (
            <img src={preview.url} alt="Preview" className="w-full rounded-lg" />
          ) : (
            <video src={preview.url} controls className="w-full rounded-lg" />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
