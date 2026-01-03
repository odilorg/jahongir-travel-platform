'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  preview?: boolean;
  className?: string;
}

interface FilePreview {
  file: File;
  url: string;
}

export function FileUpload({
  onUpload,
  accept = 'image/*',
  multiple = false,
  maxSize = 5,
  maxFiles = 10,
  preview = true,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Max size: ${maxSize}MB`);
      return false;
    }

    // Check file type if accept is specified
    if (accept && accept !== '*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const fileType = file.type;
      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        toast.error(`File ${file.name} is not an accepted file type`);
        return false;
      }
    }

    return true;
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: FilePreview[] = [];

    // Check max files limit
    if (!multiple && fileList.length > 1) {
      toast.error('Only one file allowed');
      return;
    }

    if (files.length + fileList.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and process each file
    Array.from(fileList).forEach((file) => {
      if (validateFile(file)) {
        newFiles.push(file);

        // Create preview for images
        if (preview && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          newPreviews.push({ file, url });
        }
      }
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newPreviews]);
      onUpload(newFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revoke object URL to free memory
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.url));
    setFiles([]);
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />

          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drag and drop files here, or{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => inputRef.current?.click()}
              >
                browse
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              {accept === 'image/*' ? 'Images' : 'Files'} up to {maxSize}MB
              {multiple && ` (max ${maxFiles} files)`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((filePreview, index) => (
              <div
                key={index}
                className="relative group rounded-lg border overflow-hidden"
              >
                {filePreview.file.type.startsWith('image/') ? (
                  <img
                    src={filePreview.url}
                    alt={filePreview.file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* File Name */}
                <div className="p-2 bg-white border-t">
                  <p className="text-xs truncate" title={filePreview.file.name}>
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(filePreview.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
