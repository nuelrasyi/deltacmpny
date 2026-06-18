'use client';

import React, { useState, useEffect } from 'react';
import { MediaAsset } from '@/types/database.types';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getMediaAssets, uploadMedia } from '@/actions/media';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaAsset) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  async function loadMedia() {
    setIsLoading(true);
    const data = await getMediaAssets();
    setMediaAssets(data as MediaAsset[]);
    setIsLoading(false);
  }

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadMedia(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      // Add the new asset to the top of the list
      setMediaAssets([result.data as MediaAsset, ...mediaAssets]);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Media Library
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className={`flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-xl appearance-none cursor-pointer focus:outline-none ${isUploading ? 'border-gray-300 opacity-70' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
              <div className="flex flex-col items-center space-y-2">
                {isUploading ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : <Upload className="w-8 h-8 text-gray-400" />}
                <span className="font-medium text-gray-600">
                  {isUploading ? 'Mengunggah ke Supabase...' : 'Klik untuk mengunggah gambar baru'}
                </span>
              </div>
              <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : mediaAssets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Belum ada gambar yang diunggah.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaAssets.map((asset) => (
              <div 
                key={asset.id}
                onClick={() => onSelect(asset)}
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-200 transition-all bg-white"
              >
                <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{asset.filename}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
