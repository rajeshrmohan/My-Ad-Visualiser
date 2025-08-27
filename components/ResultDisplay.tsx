
import React from 'react';
import type { GeneratedImage } from '../types';
import Loader from './Loader';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  images: GeneratedImage[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, images }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="w-full text-center p-8 bg-red-50 border-2 border-red-200 rounded-xl">
        <span className="text-4xl" role="img" aria-label="error">😵</span>
        <h3 className="text-xl font-bold text-red-700 mt-3">An Error Occurred</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full text-center p-8 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl">
        <span className="text-4xl" role="img" aria-label="telescope">🔭</span>
        <h3 className="text-xl font-bold text-slate-700 mt-3">Your mockups will appear here</h3>
        <p className="text-slate-500 mt-1">Once you generate them, of course!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center mb-6">✨ Your Ad Mockups! ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <img src={image.imageUrl} alt={`Ad mockup for ${image.surfaceName}`} className="w-full h-auto object-cover" />
            <div className="p-4 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">{image.surfaceName}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;
