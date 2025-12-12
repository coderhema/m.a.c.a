"use client";

import React, { useState, useRef, useEffect } from "react";
import { LiveKitRoom, VideoTrack, RoomAudioRenderer, useParticipants, useTracks, TrackReference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

interface LiveKitAvatarSessionProps {
  livekitUrl: string;
  token: string;
  onDisconnect?: () => void;
  children?: React.ReactNode;
  showSelfView?: boolean;
}

// Self-view camera component - shows user's own camera feed
const SelfViewCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 320, height: 240 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.log("Camera not available for self-view:", err);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!hasCamera) return null;

  return (
    <div
      className={`absolute z-40 transition-all duration-300 ${
        isMinimized
          ? "top-4 right-4 w-12 h-12"
          : "top-4 right-4 w-24 h-18 md:w-28 md:h-20"
      }`}
    >
      <div
        className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/40 shadow-xl cursor-pointer bg-black"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        {/* Label */}
        {!isMinimized && (
          <div className="absolute bottom-0.5 left-0.5 bg-black/70 px-1 py-0.5 rounded text-[8px] text-white">
            You
          </div>
        )}
      </div>
    </div>
  );
};

// Custom video renderer to display avatar video
const AvatarVideoRenderer: React.FC = () => {
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Find the avatar's video track (typically from a remote participant)
  // Filter out placeholders by checking if publication exists (type guard)
  const avatarVideoTrack = tracks.find(
    (track): track is TrackReference => 
      track.publication !== undefined && !track.participant.isLocal
  );

  if (!avatarVideoTrack) {
    return (
      <div className="absolute rounded-2xl inset-0 flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-sm">Waiting for avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden">
      <VideoTrack
        trackRef={avatarVideoTrack}
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
};

export const LiveKitAvatarSession: React.FC<LiveKitAvatarSessionProps> = ({
  livekitUrl,
  token,
  onDisconnect,
  children,
  showSelfView = true,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      connect={true}
      onConnected={() => {
        console.log("Connected to LiveKit room");
        setIsConnected(true);
      }}
      onDisconnected={() => {
        console.log("Disconnected from LiveKit room");
        setIsConnected(false);
        onDisconnect?.();
      }}
      onError={(error) => {
        console.error("LiveKit error:", error);
      }}
      audio={true}
      video={false}
    >
      {/* Audio renderer for voice */}
      <RoomAudioRenderer />
      
      {/* Custom avatar video renderer */}
      <AvatarVideoRenderer />
      
      {/* Self-view camera (picture-in-picture) */}
      {showSelfView && <SelfViewCamera />}
      
      {/* Connection status overlay */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900 bg-gradient-to-b from-black/60 z-50">
          <div className="flex flex-col items-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm">Connecting to LiveKit...</p>
          </div>
        </div>
      )}
      
      {children}
    </LiveKitRoom>
  );
};
