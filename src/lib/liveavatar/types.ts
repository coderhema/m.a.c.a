export interface AvatarConfig {
    quality: string;
    avatarId: string;
    voiceId?: string;
    knowledgeBaseId?: string;
}

// Define types for the callback functions
type StateChangeCallback = (state: string) => void;
type StreamReadyCallback = (ready: boolean) => void;
type ConnectionQualityCallback = (quality: string) => void;
type TalkingCallback = (talking: boolean) => void;
type MutedCallback = (muted: boolean) => void;
type VoiceChatActiveCallback = (active: boolean) => void;

// Define the LiveAvatarSession interface based on observed usage
export interface LiveAvatarSession {
  // Event handling methods
  on(event: "state_changed", callback: StateChangeCallback): void;
  on(event: "stream_ready", callback: StreamReadyCallback): void;
  on(event: "connection_quality_changed", callback: ConnectionQualityCallback): void;
  on(event: "avatar_talking", callback: TalkingCallback): void;
  on(event: "user_talking", callback: TalkingCallback): void;
  on(event: "muted", callback: MutedCallback): void;
  on(event: "voice_chat_active", callback: VoiceChatActiveCallback): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
  
  off(event: "state_changed", callback: StateChangeCallback): void;
  off(event: "stream_ready", callback: StreamReadyCallback): void;
  off(event: "connection_quality_changed", callback: ConnectionQualityCallback): void;
  off(event: "avatar_talking", callback: TalkingCallback): void;
  off(event: "user_talking", callback: TalkingCallback): void;
  off(event: "muted", callback: MutedCallback): void;
  off(event: "voice_chat_active", callback: VoiceChatActiveCallback): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
  
  // Session control methods
  start(): Promise<void>;
  stop(): Promise<void>;
  keepAlive(): Promise<void>;
  attachElement(element: HTMLVideoElement): void;
  
  // Other methods observed in the codebase
  interrupt(): Promise<void> | void;
  repeat(message: string): Promise<void> | void;
  startListening(): Promise<void> | void;
  stopListening(): Promise<void> | void;
  
  // Voice chat methods
  startVoiceChat(): Promise<void>;
  stopVoiceChat(): Promise<void>;
  
  // Text chat methods
  sendText(message: string): Promise<void>;
}

// Session states as strings since the exact enum values are not accessible
export type SessionState = 
  | "inactive"
  | "connecting"
  | "loading"
  | "active"
  | "disconnected"
  | "error";