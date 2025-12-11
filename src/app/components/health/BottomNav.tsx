import Link from "next/link";

export default function BottomNav() {
  const navItems = [
    { icon: "home", label: "Home", active: true, href: "/health/dashboard" },
    { icon: "description", label: "File", active: false, href: "#" },
    { icon: "add", label: "", active: false, href: "#", isFab: true },
    { icon: "credit_card", label: "My card", active: false, href: "#" },
    { icon: "person", label: "Profile", active: false, href: "#" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-4 pb-8 flex justify-between items-center z-50">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`flex flex-col items-center gap-1 ${
            item.active ? "text-white" : "text-gray-400"
          }`}
        >
          {item.isFab ? (
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center -mt-8 backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-white">add</span>
            </div>
          ) : (
            <>
              <span className={`material-symbols-outlined ${item.active ? "fill-current" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
