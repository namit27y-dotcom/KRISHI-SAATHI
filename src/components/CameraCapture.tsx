import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Upload, Image as ImageIcon, Check, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (base64Data: string) => void;
  title?: string;
  overlayText?: string;
}

export default function CameraCapture({
  onCapture,
  title = "Capture Plant Photo",
  overlayText = "Center a single leaf or the whole plant in the frame"
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    try {
      if (stream) {
        stopCamera();
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera capture access error:", err);
      setCameraError("Camera access denied or unavailable. Please upload a photo instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set standard dimensions for client-side compression (<500kb)
        // High quality but optimized size: 800x800 or similar
        const width = 800;
        const height = (video.videoHeight / video.videoWidth) * width;
        canvas.width = width;
        canvas.height = height;

        // Draw image onto canvas
        ctx.drawImage(video, 0, 0, width, height);

        // Compress image using canvas toJpeg quality 0.75
        const base64 = canvas.toDataURL("image/jpeg", 0.75);
        setCapturedImage(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Create an image to render on canvas for optimized compression
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const width = 800;
            const height = (img.height / img.width) * width;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL("image/jpeg", 0.75);
            setCapturedImage(base64);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSelection = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const resetSelection = () => {
    setCapturedImage(null);
    setCameraError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-lg mx-auto" id="camera-capture-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Camera className="w-5 h-5 text-emerald-600" />
        {title}
      </h3>

      {cameraError && (
        <div className="mb-4 bg-amber-50 text-amber-800 text-xs rounded-xl p-3 border border-amber-100">
          {cameraError}
        </div>
      )}

      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-4 flex items-center justify-center">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover transform scale-x-100"
            />
            
            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/50 m-6 rounded-lg flex items-end justify-center pb-4">
              <span className="bg-black/65 text-white text-[11px] px-3 py-1.5 rounded-full text-center">
                {overlayText}
              </span>
            </div>

            {/* Live Camera Controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
              <button
                onClick={toggleCameraFacing}
                className="bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition-all"
                title="Switch Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={capturePhoto}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg border-4 border-white transition-all scale-110"
                title="Capture"
              >
                <Camera className="w-6 h-6" />
              </button>

              <button
                onClick={stopCamera}
                className="bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition-all"
                title="Stop Camera"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : capturedImage ? (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
              <button
                onClick={confirmSelection}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 font-medium"
                id="btn-confirm-image"
              >
                <Check className="w-5 h-5" /> Confirm Image
              </button>
              <button
                onClick={resetSelection}
                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 font-medium"
                id="btn-cancel-image"
              >
                <X className="w-5 h-5" /> Retake
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-3">
            <ImageIcon className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-medium">No live feed or image uploaded</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button
                onClick={startCamera}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                id="btn-start-camera"
              >
                <Camera className="w-4 h-4" /> Start Camera
              </button>
              
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border border-slate-200">
                <Upload className="w-4 h-4" /> Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
