"use client";

import React, { useState } from "react";
import { LiveKitRoom, VideoTrack, RoomAudioRenderer, useParticipants, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

interface LiveKitAvatarSessionProps {
  livekitUrl: string;
  token: string;
  onDisconnect?: () => void;
  children?: React.ReactNode;
}

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
  const avatarVideoTrack = tracks.find(track => !track.participant.isLocal);

  if (!avatarVideoTrack) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-sm">Waiting for avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <VideoTrack
        trackRef={avatarVideoTrack}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const LiveKitAvatarSession: React.FC<LiveKitAvatarSessionProps> = ({
  livekitUrl,
  token,
  onDisconnect,
  children,
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
      
      {/* Connection status overlay */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
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
