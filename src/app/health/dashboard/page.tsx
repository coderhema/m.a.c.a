import AppointmentCard from "@/app/components/health/AppointmentCard";
import BottomNav from "@/app/components/health/BottomNav";
import ReminderList from "@/app/components/health/ReminderList";
import TreatmentStats from "@/app/components/health/TreatmentStats";
import Image from "next/image";

export default function HealthDashboard() {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans p-6 pb-24">
      {/* Status Bar Placeholder (iOS style) */}
      <div className="h-4 w-full mb-4"></div>

      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
        </button>
        <span className="font-medium text-lg">Welcome Back</span>
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
        </button>
      </div>

      {/* User Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700 border-2 border-white/10 relative">
             <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-xs">Doc</div>
          </div>
          <div>
            <h1 className="text-white font-bold text-md leading-tight">Doc. Wilsonk</h1>
            <p className="text-gray-400 text-sm">Cardiologist</p>
          </div>
        </div>
        <button className="relative">
          <span className="material-symbols-outlined text-white">notifications</span>
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-black"></span>
        </button>
      </div>

      <h2 className="text-white text-xl font-bold mb-4">Upcoming Appointments</h2>
      
      <AppointmentCard />
      
      <ReminderList />
      
      <TreatmentStats />
      
      <BottomNav />
    </div>
  );
}
