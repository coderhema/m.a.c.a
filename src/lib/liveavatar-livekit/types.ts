export interface LiveAvatarSessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export interface LiveAvatarContextType {
  sessionData: LiveAvatarSessionData | null;
  isConnected: boolean;
  error: string | null;
}
