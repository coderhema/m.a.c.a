import Image from "next/image";

export default function AppointmentCard() {
  return (
    <div className="bg-[#1C1C1E] rounded-3xl p-5 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-600 relative">
             {/* Note: In a real app, use a real image. Using a colored div fallback if image fails or placeholder */}
             <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center text-xs text-neutral-400">Img</div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Mr. Adams</h3>
            <p className="text-gray-400 text-sm">Cancerous Patient</p>
          </div>
        </div>
        <button className="bg-[#4D8EFF] hover:bg-[#3d7add] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
          Reschedule
        </button>
      </div>

      <div className="bg-[#2C2C2E] rounded-2xl p-4 flex justify-between items-center">
        <div>
          <div className="text-white font-medium mb-1">26 April, 2025</div>
          <div className="text-gray-400 text-xs">Date</div>
        </div>
        <div className="h-8 w-[1px] bg-white/10"></div>
        <div>
          <div className="text-white font-medium mb-1">08:00 pm - 08:30 pm</div>
          <div className="text-gray-400 text-xs">Time</div>
        </div>
      </div>
    </div>
  );
}
