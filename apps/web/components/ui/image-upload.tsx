"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  folder: string
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  folder,
  maxSize = 5,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value ? [value as string] : [])
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate file size
    for (const file of Array.from(files)) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is ${maxSize}MB`)
        return
      }
    }

    setUploading(true)

    try {
      const formData = new FormData()

      if (multiple) {
        // Upload multiple images
        Array.from(files).forEach((file) => {
          formData.append('images', file)
        })
        formData.append('folder', folder)

        const res = await fetch('http://localhost:4000/api/uploads/images', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Upload failed')
        }

        const newUrls = data.urls.map((url: string) => `http://localhost:4000${url}`)
        setPreview([...preview, ...newUrls])
        onChange([...(Array.isArray(value) ? value : []), ...data.paths])
      } else {
        // Upload single image
        formData.append('image', files[0])
        formData.append('folder', folder)

        const res = await fetch('http://localhost:4000/api/uploads/image', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Upload failed')
        }

        const newUrl = `http://localhost:4000${data.url}`
        setPreview([newUrl])
        onChange(data.path)
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((_, i) => i !== index)
      const newPreview = preview.filter((_, i) => i !== index)
      setPreview(newPreview)
      onChange(newValue)
    } else {
      setPreview([])
      onChange('')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || (!multiple && preview.length > 0)}
          variant="outline"
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {preview.length > 0 ? 'Add More Images' : 'Upload Image'}
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          Max file size: {maxSize}MB. Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {preview.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder when no images */}
      {preview.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No images uploaded yet
          </p>
        </div>
      )}
    </div>
  )
}
