
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseCameraProps {
  onFrame?: (imageData: ImageData) => void;
  frameRate?: number;
  withAudio?: boolean;
  onFaceDetection?: (faces: { count: number, multiple: boolean }) => void;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreaming: boolean;
  hasPermission: boolean | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  isPiPActive: boolean;
  togglePiP: () => void;
  multipleFacesDetected: boolean;
  faceCount: number;
}

const useCamera = ({
  onFrame,
  frameRate = 1,
  withAudio = false,
  onFaceDetection
}: UseCameraProps = {}): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const frameProcessorRef = useRef<number | null>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);

  // Initialize face detector if supported
  useEffect(() => {
    const initializeFaceDetector = async () => {
      if ('FaceDetector' in window) {
        try {
          faceDetectorRef.current = new (window as any).FaceDetector({
            maxDetectedFaces: 5,
            fastMode: true
          });
          console.log("Face detector initialized");
        } catch (error) {
          console.error("Error initializing face detector:", error);
        }
      } else {
        console.warn("FaceDetector API not supported in this browser");
      }
    };

    initializeFaceDetector();
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      stopCamera();
      if (frameProcessorRef.current) {
        cancelAnimationFrame(frameProcessorRef.current);
      }
    };
  }, []);

  // Start the camera stream
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access is not supported by your browser");
        setHasPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: withAudio
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setHasPermission(true);
        
        // Process frames if callback is provided or face detection is needed
        if ((onFrame || onFaceDetection || faceDetectorRef.current) && canvasRef.current) {
          processCameraFrames();
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, [onFrame, withAudio, onFaceDetection]);

  // Process frames from camera for analysis
  const processCameraFrames = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const processFrame = async () => {
      if (isStreaming && video.readyState === 4) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        if (onFrame) {
          onFrame(imageData);
        }

        // Perform face detection if supported
        if (faceDetectorRef.current) {
          try {
            const faces = await faceDetectorRef.current.detect(canvas);
            const count = faces.length;
            const multiple = count > 1;
            
            setFaceCount(count);
            setMultipleFacesDetected(multiple);
            
            if (onFaceDetection) {
              onFaceDetection({ count, multiple });
            }

            // Draw rectangles around detected faces for debugging
            context.strokeStyle = multiple ? 'red' : 'green';
            context.lineWidth = 3;
            
            faces.forEach(face => {
              const { boundingBox } = face;
              context.strokeRect(
                boundingBox.x,
                boundingBox.y,
                boundingBox.width,
                boundingBox.height
              );
            });
          } catch (error) {
            console.error("Face detection error:", error);
          }
        }
      }

      // Process frames at specified rate
      setTimeout(() => {
        frameProcessorRef.current = requestAnimationFrame(processFrame);
      }, 1000 / frameRate);
    };

    frameProcessorRef.current = requestAnimationFrame(processFrame);
  }, [isStreaming, frameRate, onFrame, onFaceDetection]);

  // Stop the camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (frameProcessorRef.current) {
      cancelAnimationFrame(frameProcessorRef.current);
      frameProcessorRef.current = null;
    }
    
    setIsStreaming(false);
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    setIsPiPActive(false);
    setFaceCount(0);
    setMultipleFacesDetected(false);
  }, []);

  // Capture a photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Return data URL of the captured image
    return canvas.toDataURL("image/png");
  }, [isStreaming]);

  // Toggle Picture-in-Picture mode
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (!isPiPActive && videoRef.current.readyState >= 2) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      }
    } catch (error) {
      console.error("PiP error:", error);
      toast.error("Picture-in-Picture mode is not supported or has been denied");
    }
  }, [isPiPActive]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    hasPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    isPiPActive,
    togglePiP,
    multipleFacesDetected,
    faceCount
  };
};

export default useCamera;
