import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
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

const useSpeechToText = ({ onTranscriptChange }: UseSpeechToTextProps = {}): UseSpeechToTextReturn => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasSupport] = useState<boolean>("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const [retryCount, setRetryCount] = useState(0);
  const recognitionRef = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!hasSupport) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interimTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(interimTranscript.trim());
      if (onTranscriptChange) onTranscriptChange(interimTranscript.trim());
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Speech recognition error: " + event.error);
      setIsListening(false);

      // Retry only if it's a network error & retry count < 3
      if (event.error === "network" && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        toast.warning(`Network error. Retrying in 3 seconds... (Attempt ${retryCount + 1}/3)`);
        setTimeout(startListening, 3000);
      } else if (retryCount >= 3) {
        toast.error("Max retry limit reached. Check your network and try again later.");
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionRef[0] = recognitionInstance;
  }, [hasSupport, onTranscriptChange, retryCount]);

  const startListening = useCallback(() => {
    if (!recognitionRef[0]) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        recognitionRef[0].start();
        setIsListening(true);
        setRetryCount(0); // Reset retry count on successful start
        toast.info("Listening...");
      }).catch(() => {
        toast.error("Microphone access denied. Please allow microphone permissions.");
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error("Couldn't start speech recognition. Please try again.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef[0] && isListening) {
      recognitionRef[0].stop();
      setIsListening(false);
      toast.success("Speech recognition stopped.");
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    if (onTranscriptChange) onTranscriptChange("");
  }, [onTranscriptChange]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
  };
};

export default useSpeechToText;
