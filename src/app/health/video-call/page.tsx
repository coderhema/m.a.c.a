import VideoControls from "@/app/components/health/VideoControls";
import Link from "next/link";

export default function VideoCallPage() {
  return (
    <div className="h-screen w-full bg-neutral-900 relative overflow-hidden flex flex-col font-sans">
      {/* Background Video Layer (Doctor) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        {/* Placeholder for Doctor's Video Frame */}
        <div className="text-white/20 text-6xl font-bold tracking-widest rotate-[-15deg] select-none">
          DR. VIDEO
        </div>
        {/* Mock Image effect overlay */}
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 pt-12 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent h-40">
        <Link href="/health/dashboard" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
           <span className="material-symbols-outlined text-white">chevron_left</span>
        </Link>
        
        <div className="text-center">
          <h2 className="text-white font-bold text-lg">Dr. Adams</h2>
          <p className="text-white/80 text-sm">5:50</p>
        </div>

        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
           <span className="material-symbols-outlined text-white">person</span>
        </button>
      </div>

      {/* Picture in Picture (Patient) */}
      <div className="absolute top-28 right-6 w-32 h-40 bg-zinc-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20">
         <div className="w-full h-full relative flex items-center justify-center bg-gray-700">
            <span className="text-white/30 text-xs">YOU</span>
            {/* Camera Switch Icon Overlay */}
            <button className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-[14px]">cameraswitch</span>
            </button>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-0 w-full px-6 z-20 flex justify-center">
        <VideoControls />
      </div>
    </div>
  );
}
