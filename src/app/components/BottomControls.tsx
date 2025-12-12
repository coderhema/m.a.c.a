import CallControls from "./CallControls";
import LiveKitCallControls from "./LiveKitCallControls";
import CustomModeCallControls from "./CustomModeCallControls";

interface BottomControlsProps {
  variant?: "liveavatar" | "livekit" | "custom";
  onStatusChange?: (status: string) => void;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export default function BottomControls({ 
  variant = "liveavatar",
  onStatusChange,
  onTranscript,
  onResponse,
}: BottomControlsProps) {
  const renderControls = () => {
    switch (variant) {
      case "custom":
        return (
          <CustomModeCallControls
            onStatusChange={onStatusChange}
            onTranscript={onTranscript}
            onResponse={onResponse}
          />
        );
      case "livekit":
        return <LiveKitCallControls />;
      default:
        return <CallControls />;
    }
  };

  return (
    <>
      {/* Bottom Controls Section */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background-dark rounded-t-xl px-4 pb-8 pt-4 space-y-4 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:bg-transparent md:border-t-0 md:shadow-none md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full md:flex md:flex-col-reverse md:gap-4 md:pb-0">
        {/* Drag Handle (Mobile Only) */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2 md:hidden"></div>
        
        {renderControls()}
      </div>
    </>
  );
}