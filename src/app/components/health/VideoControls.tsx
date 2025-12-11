export default function VideoControls() {
  const buttons = [
    { icon: "more_horiz", label: "More", bg: "bg-black/60", isEnd: false },
    { icon: "bluetooth", label: "Bluetooth", bg: "bg-white", text: "text-black", isEnd: false },
    { icon: "videocam", label: "Camera", bg: "bg-white", text: "text-black", isEnd: false },
    { icon: "mic_off", label: "Mic", bg: "bg-black/60", isEnd: false },
    { icon: "call_end", label: "End", bg: "bg-[#D92D20]", isEnd: true },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-black rounded-[40px] w-full max-w-sm mx-auto backdrop-blur-md shadow-2xl border border-white/5">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            btn.bg
          } ${btn.text || "text-white"}`}
        >
          <span className="material-symbols-outlined text-2xl">{btn.icon}</span>
        </button>
      ))}
    </div>
  );
}
