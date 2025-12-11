"use client";

export default function HealthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-4">
      <div className="max-w-md w-full bg-black rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">M.A.C.A.</h1>
        <p className="text-gray-400 text-center mb-8">Medical AI Consultation Assistant</p>
        
        <div className="space-y-4">
          <button 
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 px-6 rounded-full transition-all transform hover:scale-105"
            onClick={() => window.location.href = '/health/dashboard'}
          >
            Start Consultation
          </button>
          
          <button 
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-full transition-all backdrop-blur-md border border-white/10"
            onClick={() => window.location.href = '/health/video-call'}
          >
            Video Call
          </button>
        </div>
      </div>
    </div>
  );
}