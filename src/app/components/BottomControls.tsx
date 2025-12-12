import CallControls from "./CallControls";
import LiveKitCallControls from "./LiveKitCallControls";
import CustomModeCallControls from "./CustomModeCallControls";

interface BottomControlsProps {
  variant?: "liveavatar" | "livekit" | "custom";
  onStatusChange?: (status: string) => void;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
  callDuration?: string;
}

export default function BottomControls({ 
  variant = "liveavatar",
  onStatusChange,
  onTranscript,
  onResponse,
  callDuration = "00:00",
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
        
        {/* Caller Info - Above Controls */}
        <div className="flex items-center justify-center gap-3 mb-2 md:mb-0 md:order-first">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="text-center">
              <h3 className="text-white text-sm font-bold">M.A.C.A.</h3>
              <p className="text-gray-400 text-xs">AI Health Practitioner • {callDuration}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase">Live</span>
            </div>
          </div>
        </div>
        
        {renderControls()}
      </div>
    </>
  );
}