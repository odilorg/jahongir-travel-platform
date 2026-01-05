'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface MultiImageUploadFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxImages?: number;
  helpText?: string;
}

export function MultiImageUploadField({
  label,
  value,
  onChange,
  folder,
  maxImages = 10,
  helpText,
}: MultiImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    const validFiles: File[] = [];

    // Validate files
    Array.from(files).forEach((file) => {
      if (!file.type.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        toast.error(`${file.name}: Only image files are allowed`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Check max images limit
    if (value.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      // Get auth token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Upload all files
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/image`,
          {
            method: 'POST',
            body: formData,
            headers,
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }

        const data = await response.json();
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${data.url}`;
      });

      const newUrls = await Promise.all(uploadPromises);
      onChange([...value, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm">
                Drag and drop images here, or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-blue-600 hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, GIF, WebP up to 5MB each
              </p>
            </>
          )}
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group rounded-lg border overflow-hidden bg-gray-50"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-28 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">Error</text></svg>';
                }}
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move left"
                  >
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Index badge */}
              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
    </div>
  );
}
