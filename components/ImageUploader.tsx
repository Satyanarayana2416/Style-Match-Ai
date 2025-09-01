import React, { useRef, useState, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  disabled: boolean;
  placeholder?: string;
  t: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageChange, disabled, placeholder = "Click to upload or drag and drop", t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleAreaClick = () => {
    if (!disabled && !isCameraOpen) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
    event.target.value = ''; // Reset input to allow re-uploading the same file
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && !isCameraOpen) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isCameraOpen) return;
    const file = event.dataTransfer.files?.[0] || null;
    onImageChange(file);
  };

  // --- Camera Logic ---
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  const openCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stopCamera(); // Stop any existing stream
      setCameraError(null);
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setIsCameraOpen(true);
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        let message: string;
        const deniedMessage = "Camera permission denied. To use the camera, please grant permission in your browser settings. You can typically do this by clicking the lock icon next to the website address and changing the Camera setting to 'Allow'.";
        
        const errorMessage = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
        const errorName = err instanceof DOMException ? err.name : '';

        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError' || errorMessage.includes('permission denied')) {
          message = deniedMessage;
        } else if (errorName === 'NotFoundError') {
          message = "No camera was found on your device.";
        } else if (errorMessage.includes('permission dismissed')) {
          message = "Camera prompt was dismissed. Click 'Use Camera' again and grant permission when asked.";
        } else {
          message = "Could not start camera. It might be in use by another application.";
        }

        setCameraError(message);
        setIsCameraOpen(false);
      }
    } else {
      setCameraError("Camera not supported on this browser.");
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      }
      
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
          onImageChange(file);
        }
        setIsCameraOpen(false);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => stopCamera();
  }, []);


  const handleCloseCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCameraOpen(false);
    stopCamera();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      <canvas ref={canvasRef} className="hidden" />

      <div
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full aspect-[4/3] bg-slate-100/80 border-2 rounded-xl flex flex-col justify-center items-center transition-all duration-300 overflow-hidden group ${
          isDragging
            ? 'border-solid border-indigo-500 scale-105 bg-indigo-50'
            : imagePreview 
              ? 'border-solid border-indigo-500' 
              : `border-dashed ${disabled ? 'cursor-not-allowed bg-slate-200' : 'border-slate-300'}`
        } ${
          !imagePreview && !isCameraOpen && !disabled ? 'hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer' : ''
        }`}
      >
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Outfit preview" className="object-contain h-full w-full" />
            <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg pointer-events-none animate-pop-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </>
        ) : isCameraOpen ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex justify-center items-end p-4">
               <button 
                 onClick={takePicture}
                 className="h-16 w-16 bg-white/90 backdrop-blur-sm rounded-full border-4 border-white/50 shadow-lg hover:bg-white transition flex items-center justify-center animate-pulse"
                 aria-label="Take Picture"
               >
                <div className="h-12 w-12 bg-white rounded-full"></div>
               </button>
            </div>
            <button 
               onClick={handleCloseCamera}
               className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition"
               aria-label="Close camera"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center p-4 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <p className="mt-2 font-semibold text-slate-600">{placeholder}</p>
            <p className="text-xs text-slate-400 mt-1">{t.fileTypes}</p>
            
            <div className="my-4 w-full max-w-xs relative flex items-center">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm">{t.or}</span>
                <div className="flex-grow border-t border-slate-300"></div>
            </div>

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openCamera(); }}
                disabled={disabled}
                className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
            >
              <CameraIcon className="w-5 h-5" />
              {t.useCamera}
            </button>
            {cameraError && <p className="text-red-500 text-xs mt-2">{cameraError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;