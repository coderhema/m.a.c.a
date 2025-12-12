import { PiArrowLeft, PiDotsThree, PiWifiHigh } from "react-icons/pi";

interface HeaderProps {
  callDuration?: string;
}

export default function Header({ callDuration = "00:00" }: HeaderProps) {
  return (
    <>
      {/* Top Header / Status Bar */}
      <div className="relative z-10 flex flex-col p-4 pt-6 space-y-4 md:space-y-0 md:flex-row md:items-start md:p-8">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center justify-center size-10 rounded-full bg-black backdrop-blur-xl border-white/5 text-white hover:bg-white/20 transition-colors" 
            aria-label="Go back"
          >
            <PiArrowLeft className="text-[24px]" />
          </button>

          {/* Doctor Info Card */}
          <div className="flex items-center justify-between bg-black backdrop-blur-xl border border-white/5 p-3 rounded-lg shadow-lg md:min-w-[300px]">
            <div className="flex items-center gap-5 pl-3">
              <div>
                <h3 className="text-white text-sm font-bold leading-tight">
                  M.A.C.A.
                </h3>
                <p className="text-gray-400 text-xs font-normal">
                 AI Health Practitioner • {callDuration}
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

          <button 
            className="flex items-center justify-center size-10 rounded-full bg-black backdrop-blur-xl border-white/5 text-white hover:bg-white/20 transition-colors" 
            aria-label="More options"
          >
            <PiDotsThree className="text-[24px]" />
          </button>
        </div>
      </div>
    </>
  );
}