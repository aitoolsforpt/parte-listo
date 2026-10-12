import React from 'react';
import { Photo } from '@/types';
import { Camera, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhotoGalleryProps {
  photos: Photo[];
  onAddPhoto: (photo: Partial<Photo>) => void;
  onRemovePhoto: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onUpdateCaption
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Por favor, selecciona un archivo de imagen (JPEG o PNG)');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo ' + MAX_SIZE_MB + ' MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onAddPhoto({
        src: reader.result as string,
        before: false,
        caption: ''
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-primary" />
          Fotografías
        </h2>
        <Button asChild>
          <label className="cursor-pointer">
            <Camera className="w-4 h-4 mr-1" />
            Añadir foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No hay fotografías añadidas</p>
          <p className="text-sm text-gray-400 mt-1">Haz clic en "Añadir foto" para documentar el antes y el después</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Antes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.filter(p => p.before).map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img src={photo.src} alt="Antes" className="w-full h-40 object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    ANTES
                  </div>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
                    placeholder="Comentario..."
                    className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 text-xs"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemovePhoto(photo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Después</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.filter(p => !p.before).map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img src={photo.src} alt="Después" className="w-full h-40 object-cover" />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    DESPUÉS
                  </div>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
                    placeholder="Comentario..."
                    className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 text-xs"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemovePhoto(photo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};