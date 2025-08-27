
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import AdSurfaceSelector from './components/AdSurfaceSelector';
import ResultDisplay from './components/ResultDisplay';
import { generateAdMockup } from './services/geminiService';
import { AD_SURFACES } from './constants';
import type { GeneratedImage } from './types';

function App() {
  const [productImage, setProductImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((base64: string, mimeType: string) => {
    setProductImage({ base64, mimeType });
  }, []);

  const handleSelectSurface = useCallback((surfaceId: string) => {
    setSelectedSurfaces(prev =>
      prev.includes(surfaceId)
        ? prev.filter(id => id !== surfaceId)
        : [...prev, surfaceId]
    );
  }, []);

  const handleGenerate = async () => {
    if (!productImage || selectedSurfaces.length === 0) {
      setError("Please upload a product image and select at least one ad surface.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const surfacesToGenerate = AD_SURFACES.filter(s => selectedSurfaces.includes(s.id));
      const promises = surfacesToGenerate.map(surface =>
        generateAdMockup(productImage.base64, productImage.mimeType, surface)
      );

      const results = await Promise.allSettled(promises);
      
      const successfulImages: GeneratedImage[] = [];
      let firstError: string | null = null;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulImages.push({
            surfaceName: surfacesToGenerate[index].name,
            imageUrl: result.value,
          });
        } else {
            console.error(result.reason);
            if(!firstError) {
              firstError = `Failed on ${surfacesToGenerate[index].name}. Please try again.`;
            }
        }
      });
      
      setGeneratedImages(successfulImages);
      if(firstError) {
          setError(firstError);
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !productImage || selectedSurfaces.length === 0 || isLoading;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Ad Visualizer <span className="text-indigo-600">AI</span>
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          See your product on any ad surface in seconds. Just upload, select, and generate!
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-12">
        <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8">
            <ImageUploader onImageUpload={handleImageUpload} />
        </div>

        {productImage && (
            <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8">
                <AdSurfaceSelector selectedSurfaces={selectedSurfaces} onSelectSurface={handleSelectSurface} />
            </div>
        )}
        
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : `✨ Generate Mockups (${selectedSurfaces.length})`}
          </button>
        </div>

        <div className="pt-8">
            <ResultDisplay isLoading={isLoading} error={error} images={generatedImages} />
        </div>
      </main>

      <footer className="text-center mt-16 py-6 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
}

export default App;
