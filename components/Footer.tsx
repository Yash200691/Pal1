import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-text)] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-baseline gap-2 text-white">
            <span className="font-devanagari text-[24px] text-[var(--color-signal)] leading-none">पल</span>
            <span className="text-white/50 px-1">·</span>
            <span className="font-sans font-bold text-[16px]">Pal</span>
            <span className="text-white/50 px-1">·</span>
            <span className="font-sans text-[13px] text-white/70 italic">A Moment That Saves a Life</span>
          </div>
          <p className="font-sans text-[12px] text-white/50 mt-4">
            Built at [Hackathon] · Open Innovation Track · Built on Haven
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
          <nav className="flex gap-6">
            <Link href="#" className="font-sans text-[13px] text-white/70 hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="font-sans text-[13px] text-white/70 hover:text-white transition-colors">Telegram Bot</Link>
            <Link href="#" className="font-sans text-[13px] text-[var(--color-courage)] font-bold hover:text-[var(--color-warmth)] transition-colors">NGO Onboarding</Link>
          </nav>
        </div>
        
      </div>
    </footer>
  );
}
