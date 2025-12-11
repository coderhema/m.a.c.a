"use client";

import { Header } from "@/app/components";
import { BottomControls } from "@/app/components";

export default function HealthDashboard() {
  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      <Header />

      {/* Middle Section - Removed self-view picture-in-picture */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
        {/* Removed Self View (Picture-in-Picture) */}
      </div>

      <BottomControls />
    </div>
  );
}