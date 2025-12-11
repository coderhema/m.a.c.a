import { PiMicrophoneSlash, PiVideoCamera, PiCameraRotate, PiPhoneX } from "react-icons/pi";

export default function CallControls() {
  return (
    <>
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
    </>
  );
}