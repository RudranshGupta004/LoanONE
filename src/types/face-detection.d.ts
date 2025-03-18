
// Type definitions for the Face Detection API
// https://developer.mozilla.org/en-US/docs/Web/API/FaceDetector

interface FaceDetectorOptions {
  maxDetectedFaces?: number;
  fastMode?: boolean;
}

interface FaceDetectionResult {
  boundingBox: DOMRectReadOnly;
  landmarks?: {
    locations: {
      x: number;
      y: number;
    }[];
    type: string;
  }[];
}

declare class FaceDetector {
  constructor(options?: FaceDetectorOptions);
  detect(image: ImageBitmapSource): Promise<FaceDetectionResult[]>;
}

interface Window {
  FaceDetector?: typeof FaceDetector;
}
