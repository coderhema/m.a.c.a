import CallControls from "./CallControls";

export default function BottomControls() {
  return (
    <>
      {/* Bottom Controls Section */}
      <div className="relative z-20 bg-background-dark rounded-t-xl px-4 pb-8 pt-4 space-y-4 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:bg-transparent md:border-t-0 md:shadow-none md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full md:flex md:flex-col-reverse md:gap-4 md:pb-0">
        {/* Drag Handle (Mobile Only) */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2 md:hidden"></div>
        
        <CallControls />
      </div>
    </>
  );
}