import { PiArrowLeft, PiDotsThree, PiWifiHigh } from "react-icons/pi";
import Link from "next/link";

interface HeaderProps {
  callDuration?: string;
}

export default function Header({ callDuration = "00:00" }: HeaderProps) {
  return (
    <>
      {/* Top Header / Status Bar */}
      <div className="relative z-10 flex flex-col p-4 pt-6 space-y-4 md:space-y-0 md:flex-row md:items-start md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button 
              className="flex items-center justify-center size-10 rounded-full bg-black backdrop-blur-xl border-white/5 text-white hover:bg-white/20 transition-colors cursor-pointer" 
              aria-label="Go back"
            >
              <PiArrowLeft className="text-[24px]" />
            </button>
          </Link>
        </div>

        {/* More options button - On the far right, visible on all screen sizes */}
        <div className="flex items-center md:gap-4 md:ml-auto">

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