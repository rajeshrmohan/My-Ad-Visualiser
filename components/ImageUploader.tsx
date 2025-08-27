
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fullBase64 = reader.result as string;
        const mimeType = file.type;
        setImagePreview(fullBase64);
        const base64Data = fullBase64.split(',')[1];
        onImageUpload(base64Data, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-1">
        1. Upload Your Product Image
      </h2>
      <p className="text-center text-slate-500 mb-6">
        Drag & drop or click to select a file.
      </p>
      <form
        className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col justify-center items-center text-center transition-colors duration-300 ${dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 bg-white'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Product Preview" className="max-h-full max-w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="p-8 cursor-pointer" onClick={onButtonClick}>
            <span className="text-5xl" role="img" aria-label="upload">📤</span>
            <p className="mt-4 font-semibold text-slate-700">
              {dragActive ? "Drop it here!" : "Click or drag file to this area to upload"}
            </p>
            <p className="text-sm text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;
