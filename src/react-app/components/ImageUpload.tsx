import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [enhancing, setEnhancing] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (images.length >= maxImages) break;
      
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images, e.target?.result as string];
        onChange(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create camera modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="relative max-w-lg w-full mx-4">
          <video id="camera-video" autoplay playsinline class="w-full rounded-lg"></video>
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button id="capture-btn" class="bg-white text-gray-900 p-4 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8"/>
              </svg>
            </button>
            <button id="close-camera" class="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const video = modal.querySelector('#camera-video') as HTMLVideoElement;
      const captureBtn = modal.querySelector('#capture-btn');
      const closeBtn = modal.querySelector('#close-camera');
      
      video.srcObject = stream;
      
      captureBtn?.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const newImages = [...images, imageData];
        onChange(newImages);
        
        stream.getTracks().forEach(track => track.stop());
        modal.remove();
      });
      
      closeBtn?.addEventListener('click', () => {
        stream.getTracks().forEach(track => track.stop());
        modal.remove();
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use file upload instead.');
    }
  };

  const enhanceImage = async (index: number) => {
    const imageUrl = images[index];
    if (!imageUrl) return;

    setEnhancing(index);
    try {
      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      if (data.enhancedUrl) {
        const newImages = [...images];
        newImages[index] = data.enhancedUrl;
        onChange(newImages);
      }
    } catch (error) {
      console.error('Error enhancing image:', error);
      alert('Failed to enhance image. Please try again.');
    } finally {
      setEnhancing(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const addImageSlot = () => {
    if (images.length < maxImages) {
      onChange([...images, '']);
    }
  };

  const handleUrlChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
      
      {/* Upload Methods */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
        
        <button
          type="button"
          onClick={openCamera}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>Take Photo</span>
        </button>

        <button
          type="button"
          onClick={addImageSlot}
          disabled={images.length >= maxImages}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Add URL</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="relative group">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => enhanceImage(index)}
                        disabled={enhancing === index}
                        className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                        title="Enhance with AI"
                      >
                        {enhancing === index ? (
                          <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Add image</p>
                  </div>
                </div>
              )}
            </div>
            <input
              type="url"
              placeholder="Or enter image URL"
              value={image}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload photos to showcase your product</p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Choose Files
            </button>
            <button
              type="button"
              onClick={openCamera}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Take Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
