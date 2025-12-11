import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Main AI Video */}
        <div
          className="w-full h-full bg-cover bg-center object-cover opacity-90"
          data-alt="Professional female doctor with stethoscope in a modern medical office looking at camera"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOp-A0wBfbdABCseJhRQ7pK22D9gTiJ7dPYaThHDwh_mQIQpCJedmWcbvQbEl4Br7OchS0HN0PW4VqksQCEetomr5MFK24QKfYInoMOq1qqeMojgb5oQZ7aXDId19InnBx7CHatyaoyNJx5IcSfzxi3ERfwtJq5jXtZtTb4On0XmR5AolcDmAeeo8cosYNQbqHFOyMjSCiYoKywYag8jr0LeAPbof0FzCsfoQNq7CpRmlKeV2TcEiUfQhqomfIQj5F6P4e-vqJjNrv")',
          }}
        ></div>
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      {/* Top Header / Status Bar */}
      <div className="relative z-10 flex flex-col p-4 pt-6 space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-start md:p-8">
        {/* Nav Bar (Mobile) / Branding (Desktop) */}
        <div className="flex items-center justify-between md:gap-4">
          <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-[24px]">
              arrow_back_ios_new
            </span>
          </button>

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

          <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors md:hidden">
            <span className="material-symbols-outlined text-[24px]">
              more_vert
            </span>
          </button>
        </div>

        {/* Doctor Info Card */}
        <div className="flex items-center justify-between bg-background-dark/80 backdrop-blur-xl border border-white/5 p-3 rounded-lg mx-2 shadow-lg md:mx-0 md:min-w-[300px]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="size-10 rounded-full bg-cover bg-center ring-2 ring-primary/50"
                data-alt="Avatar icon of AI medical assistant"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdAjt4OtnBnUv5EFOqHBGMGhC4sfFg5psO2vCpVBEzjtkYqYI35f_ZX11qQehoC0FfREUkUvwhgGGhucxSLuudsoeERShYRZ1BRuTnmmGZbitWvBuekcwC_SznbRk4vqfSSXFgdzq7p1Kq6zz8HnphohgGyFl0QFqhHUq2W52_rJ5ukfJzbbmIGNDKBSZq-ltPA2TxUYyTjbiJIpK9r2x_nhF6dWqwsz6sxWGySPazTmuF2NF3SeSvaxtOZ7lgxuBH7L8Vwx3gc4FC")',
                }}
              ></div>
              <div className="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-[2px]">
                <span className="material-symbols-outlined text-primary text-[14px] font-bold">
                  verified
                </span>
              </div>
            </div>
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
            <span className="material-symbols-outlined text-primary text-[20px]">
              signal_cellular_alt
            </span>
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

      {/* Middle Section */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
        {/* Self View (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-24 h-32 md:w-48 md:h-64 md:top-8 md:right-8 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-800 transition-all">
          <div
            className="w-full h-full bg-cover bg-center"
            data-alt="User looking at phone camera for video call"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNtQNfOorGdqTpzvKT_ah3Hh2GeWORFSvN5FtOYSX2ShdBs7d0O0pfCtQTbfEmGBPuqxwdRMl2WUw2CQhWTW_hoCBwjrOmXo-nNbyD7NEioxD2J0W-TSLF7INkxyxpjI6Gdo_9luk4NuPRR2c_gRLWmCLb6J-97cBEH7l3OPoNWwGLiBK1eVc7SIOXrXTFjDPPu8DV2xFH2PsNpqLvj0USm2xSDMH5PdxqrJsS6Q9-FNaMjkgp0EXQQWfw-k-Mh-JW7gUvOZEPaXbv")',
            }}
          ></div>
        </div>

        {/* Chat / Transcript Bubble */}
        <div className="flex flex-col items-start space-y-3 mb-6 md:mb-12 md:max-w-xl lg:max-w-2xl w-full">
          {/* AI Message */}
          <div className="max-w-[85%] md:max-w-full self-start animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1 pl-2">
              <span className="text-primary text-xs font-semibold">
                Dr. Sarah AI
              </span>
            </div>
            <div className="p-4 md:p-6 rounded-2xl rounded-tl-sm bg-background-dark/90 backdrop-blur-md border border-white/10 text-white shadow-lg">
              <p className="text-sm md:text-base leading-relaxed font-normal">
                I&apos;ve reviewed your heart rate data. It looks slightly
                elevated. Have you been experiencing any dizziness or shortness
                of breath lately?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Section */}
      <div className="relative z-20 bg-background-dark rounded-t-xl px-4 pb-8 pt-4 space-y-4 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:bg-transparent md:border-t-0 md:shadow-none md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full md:flex md:flex-col-reverse md:gap-4 md:pb-0">

        {/* Drag Handle (Mobile Only) */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2 md:hidden"></div>

        {/* Input Field */}
        <div className="flex items-center gap-2 bg-background-dark/90 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-xl">
          <label className="flex-1 relative group">
            <input
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="Type your symptoms..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
              keyboard
            </span>
          </label>
          <button className="flex items-center justify-center size-12 rounded-full bg-primary hover:bg-primary/90 text-background-dark transition-transform active:scale-95 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[24px] font-medium -ml-0.5 mt-0.5">
              send
            </span>
          </button>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-between px-2 pt-2 md:justify-center md:gap-8 md:bg-black/40 md:backdrop-blur-xl md:p-3 md:rounded-full md:border md:border-white/10 md:w-fit md:mx-auto">
          {/* Mute Toggle */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                mic_off
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Mute</span>
          </button>

          {/* Camera Toggle */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                videocam
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Camera</span>
          </button>

          {/* Flip Camera */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                flip_camera_ios
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Flip</span>
          </button>

          {/* End Call */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex items-center justify-center size-14 rounded-full bg-red-500/90 group-hover:bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                call_end
              </span>
            </div>
            <span className="text-[10px] text-red-400 font-medium md:hidden">End</span>
          </button>
        </div>
      </div>
    </div>
  );
}
