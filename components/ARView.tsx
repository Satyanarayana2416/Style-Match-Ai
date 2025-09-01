import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CaptureIcon } from './icons/CaptureIcon';

// TypeScript declarations for global scripts
declare const SelfieSegmentation: any;
declare const tf: any;

interface ARViewProps {
  sareeImageSrc: string;
  onClose: () => void;
  onAnalyze: (imageDataUrl: string) => void;
  t: any;
}

const ARView: React.FC<ARViewProps> = ({ sareeImageSrc, onClose, onAnalyze, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sareeImageRef = useRef<HTMLImageElement>(new Image());
  // FIX: Explicitly initialize useRef with null to avoid ambiguity with an implicit undefined initial value, which can cause confusing compiler errors.
  const animationFrameId = useRef<number | null>(null);
  const segmenterRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [arError, setArError] = useState<string | null>(null);

  const onResults = useCallback((results: any) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const sareeImage = sareeImageRef.current;

    if (!video || !canvas || !sareeImage.complete) {
      return;
    }

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the saree image tiled as a background pattern
    const pattern = canvasCtx.createPattern(sareeImage, 'repeat');
    if (pattern) {
        canvasCtx.fillStyle = pattern;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Use the segmentation mask to cut out the person shape from the saree pattern
    canvasCtx.globalCompositeOperation = 'destination-in';
    canvasCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

    // Draw the original video underneath the cutout pattern
    canvasCtx.globalCompositeOperation = 'destination-over';
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Reset composite operation for next frame
    canvasCtx.globalCompositeOperation = 'source-over';

  }, []);

  const startAR = useCallback(async () => {
    setIsLoading(true);
    setArError(null);
    try {
        const segmenter = new SelfieSegmentation({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}` });
        segmenter.setOptions({ modelSelection: 1 });
        segmenter.onResults(onResults);
        segmenterRef.current = segmenter;

        await tf.setBackend('webgl');
        await segmenter.initialize();

        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                const processFrame = async () => {
                    if (videoRef.current && segmenterRef.current && !capturedImage) {
                        await segmenterRef.current.send({ image: videoRef.current });
                        animationFrameId.current = requestAnimationFrame(processFrame);
                    }
                };
                processFrame();
                setIsLoading(false);
            };
        }
    } catch (error) {
        let message: string;
        const errorName = error instanceof DOMException ? error.name : '';

        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
            message = t.arPermissionDenied;
        } else if (errorName === 'NotFoundError') {
            message = t.arNoCamera;
        } else {
            message = t.arGenericError;
        }
        
        setArError(message);
        setIsLoading(false);
    }
  }, [onResults, t, capturedImage]);

  useEffect(() => {
    sareeImageRef.current.crossOrigin = "anonymous";
    sareeImageRef.current.src = sareeImageSrc;
    sareeImageRef.current.onload = () => {
        startAR();
    };

    return () => {
        if (animationFrameId.current !== null) {
            cancelAnimationFrame(animationFrameId.current);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        segmenterRef.current?.close();
    };
  }, [startAR, sareeImageSrc]);

  const handleCapture = () => {
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart the animation loop
    startAR();
  };

  const handleAnalyze = () => {
    if (capturedImage) {
      onAnalyze(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in p-4">
      {arError ? (
        <div className="text-center text-white max-w-md p-6 bg-red-500/30 border border-red-500 rounded-lg shadow-2xl animate-pop-in">
          <h3 className="text-xl font-bold mb-3">{t.errorTitle}</h3>
          <p className="text-red-100">{arError}</p>
          <button 
            onClick={onClose} 
            className="mt-6 bg-white text-slate-800 font-bold py-2 px-8 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {t.close}
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="hidden"></video>
          <canvas ref={canvasRef} className="w-full max-w-2xl h-auto aspect-[4/3] rounded-lg shadow-2xl"></canvas>

          {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <p className="mt-4 text-lg font-semibold">{t.initializingAR}</p>
              </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-8 bg-black/30">
              {capturedImage ? (
                  <>
                      <button onClick={handleRetake} className="bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors">{t.retake}</button>
                      <button onClick={handleAnalyze} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors">{t.analyzeThisLook}</button>
                  </>
              ) : (
                  <button onClick={handleCapture} disabled={isLoading} aria-label="Capture Photo" className="disabled:opacity-50">
                      <CaptureIcon />
                  </button>
              )}
          </div>

          <button onClick={onClose} aria-label="Close AR View" className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ARView;