import Image from "next/image";
import { PiArrowLeft, PiDotsThree, PiCheck, PiKeyboard, PiPaperPlaneTilt, PiMicrophoneSlash, PiVideoCamera, PiCameraRotate, PiPhoneX, PiWifiHigh } from "react-icons/pi";

export default function Home() {
  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Gradient Overlay for Text Readability */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      {/* Top Header / Status Bar */}
      <div className="relative z-10 flex flex-col p-4 pt-6 space-y-4 md:space-y-0 md:flex-row md:items-start md:p-8">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors" aria-label="Go back">
            <PiArrowLeft className="text-[24px]" />
          </button>

          {/* Doctor Info Card - Removed profile picture, made background black */}
          <div className="flex items-center justify-between bg-black backdrop-blur-xl border border-white/5 p-3 rounded-lg shadow-lg md:min-w-[300px]">
            <div className="flex items-center gap-3">
              {/* Removed profile picture div */}
              <div>
                <h3 className="text-white text-sm font-bold leading-tight">
                  Dr. Sarah AI
                </h3>
                <p className="text-gray-400 text-xs font-normal">
                  General Practitioner • 04:23
                </p>
              </div>
            </div>
            <div className="flex gap-1 md:hidden">
              <PiWifiHigh className="text-primary text-[20px]" />
            </div>
            {/* Desktop Status Tag */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 ml-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* More options button - On the far right, visible on all screen sizes */}
        <div className="flex items-center md:gap-4 md:ml-auto">
          {/* Mobile Status Tag */}
          <div className="flex flex-col items-center md:hidden">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                Live Secure
              </span>
            </div>
          </div>

          <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors" aria-label="More options">
            <PiDotsThree className="text-[24px]" />
          </button>
        </div>
      </div>

      {/* Middle Section - Removed self-view picture-in-picture */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
        {/* Removed Self View (Picture-in-Picture) */}
      </div>

      {/* Bottom Controls Section */}
      <div className="relative z-20 bg-background-dark rounded-t-xl px-4 pb-8 pt-4 space-y-4 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:bg-transparent md:border-t-0 md:shadow-none md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full md:flex md:flex-col-reverse md:gap-4 md:pb-0">

        {/* Drag Handle (Mobile Only) */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2 md:hidden"></div>

        {/* Removed Input Field (Chat Area) */}

        {/* Call Controls */}
        <div className="flex items-center justify-between px-2 pt-2 md:justify-center md:gap-8 md:bg-black/40 md:backdrop-blur-xl md:p-3 md:rounded-full md:border md:border-white/10 md:w-fit md:mx-auto">
          {/* Mute Toggle */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <PiMicrophoneSlash 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Mute</span>
          </button>

          {/* Camera Toggle */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <PiVideoCamera 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Camera</span>
          </button>

          {/* Flip Camera */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <PiCameraRotate 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Flip</span>
          </button>

          {/* End Call */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-red-500/90 group-hover:bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95">
              <PiPhoneX 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </div>
            <span className="text-[10px] text-red-400 font-medium md:hidden">End</span>
          </button>
        </div>
      </div>
    </div>
  );
}