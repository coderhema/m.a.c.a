"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

interface VisionContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isAnalyzing: boolean;
  lastAnalysis: string | null;
  captureAndAnalyze: () => Promise<string | null>;
  setVideoRef: (ref: HTMLVideoElement | null) => void;
}

const VisionContext = createContext<VisionContextType | null>(null);

export function VisionProvider({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  const setVideoRef = useCallback((ref: HTMLVideoElement | null) => {
    videoRef.current = ref;
  }, []);

  const captureAndAnalyze = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current) {
      console.error("Vision: No video element available");
      return null;
    }

    setIsAnalyzing(true);

    try {
      // Create canvas to capture frame
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const base64Image = canvas.toDataURL("image/jpeg", 0.8);
      
      console.log("Vision: Captured frame, sending to API...");

      // Send to vision API
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Vision API error");
      }

      const data = await response.json();
      const analysis = data.analysis;

      console.log("Vision: Analysis result:", analysis);
      setLastAnalysis(analysis);
      
      return analysis;
    } catch (error) {
      console.error("Vision: Capture and analyze failed:", error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <VisionContext.Provider
      value={{
        videoRef,
        isAnalyzing,
        lastAnalysis,
        captureAndAnalyze,
        setVideoRef,
      }}
    >
      {children}
    </VisionContext.Provider>
  );
}

export function useVision() {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error("useVision must be used within a VisionProvider");
  }
  return context;
}
