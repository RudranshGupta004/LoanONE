
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

// Add TypeScript interface for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      }
    }
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Add interface for the window object
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface UseSpeechToTextProps {
  onTranscriptChange?: (transcript: string) => void;
}

interface UseSpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasSupport: boolean;
}

const useSpeechToText = ({ 
  onTranscriptChange 
}: UseSpeechToTextProps = {}): UseSpeechToTextReturn => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasSupport, setHasSupport] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setHasSupport(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Add event listeners
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const newTranscript = event.results[current][0].transcript;
        setTranscript(newTranscript);
        
        if (onTranscriptChange) {
          onTranscriptChange(newTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Speech recognition failed. Please try again.");
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        toast.info("Listening...");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error("Couldn't start speech recognition. Please try again.");
      }
    } else if (!hasSupport) {
      toast.error("Speech recognition is not supported in your browser.");
    }
  }, [recognition, isListening, hasSupport]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      toast.success("Speech recognition stopped.");
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    if (onTranscriptChange) {
      onTranscriptChange("");
    }
  }, [onTranscriptChange]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport
  };
};

export default useSpeechToText;
