
import React from 'react';
import { AD_SURFACES } from '../constants';
import type { AdSurface } from '../types';

interface AdSurfaceSelectorProps {
  selectedSurfaces: string[];
  onSelectSurface: (surfaceId: string) => void;
}

const AdSurfaceSelector: React.FC<AdSurfaceSelectorProps> = ({ selectedSurfaces, onSelectSurface }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-1">
        2. Select Ad Surfaces
      </h2>
      <p className="text-center text-slate-500 mb-6">
        Choose where you want to see your product.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {AD_SURFACES.map((surface: AdSurface) => {
          const isSelected = selectedSurfaces.includes(surface.id);
          return (
            <div
              key={surface.id}
              className={`rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white'}`}
              onClick={() => onSelectSurface(surface.id)}
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                <img src={surface.imageUrl} alt={surface.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">{surface.emoji}</span>
                <span className="font-semibold text-slate-700 text-center text-sm">{surface.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdSurfaceSelector;
