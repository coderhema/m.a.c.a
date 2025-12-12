"use client";

import { PiMicrophoneSlash, PiMicrophone, PiVideoCamera, PiCameraRotate, PiPhoneX, PiHandPalm, PiWaveSine } from "react-icons/pi";
import { useVoiceChat, useAvatarActions, useSession } from "@/lib/liveavatar";
import { log } from "@/lib/logger";

export default function CallControls() {
  const { isActive, isMuted, start, stop, mute, unmute } = useVoiceChat();
  const { interrupt } = useAvatarActions("FULL");
  const { stopSession, keepAlive } = useSession();

  const handleVoiceChatToggle = () => {
    if (isActive) {
      log.info("User stopping voice chat via controls");
      stop();
    } else {
      log.info("User starting voice chat via controls");
      start();
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      log.debug("User unmuting via controls");
      unmute();
    } else {
      log.debug("User muting via controls");
      mute();
    }
  };

  return (
    <>
      {/* Call Controls */}
      <div className="flex items-center justify-between px-2 pt-2 md:justify-center md:gap-8 md:bg-black/40 md:backdrop-blur-xl md:p-3 md:rounded-full md:border md:border-white/10 md:w-fit md:mx-auto">
        
        {/* Voice Chat Toggle */}
        <button 
          onClick={handleVoiceChatToggle}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`flex items-center justify-center size-14 rounded-full ${isActive ? 'bg-primary text-black' : 'bg-white/10 text-white'} group-hover:bg-white/20 transition-all active:scale-95`}>
            {isActive ? (
              <PiMicrophone 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            ) : (
              <PiMicrophoneSlash 
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              />
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-medium md:hidden">{isActive ? "On" : "Off"}</span>
        </button>

        {/* Mute Toggle (Only if active) */}
         <button 
           onClick={handleMuteToggle}
           className={`flex flex-col items-center gap-1 group ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}
         >
          <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
            {isMuted ? (
              <PiMicrophoneSlash
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              />
            ) : (
              <PiMicrophone
                className="text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-medium md:hidden">Mute</span>
        </button>


        {/* Interrupt */}
        <button 
          onClick={interrupt}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
            <PiHandPalm 
              className="text-[28px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium md:hidden">Interrupt</span>
        </button>

        {/* Keep Alive */}
        <button 
          onClick={keepAlive}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
             <PiWaveSine
              className="text-[28px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium md:hidden">Keep Alive</span>
        </button>

        {/* End Call */}
        <button 
          onClick={stopSession}
          className="flex flex-col items-center gap-1 group"
        >
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