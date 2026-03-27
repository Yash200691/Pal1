"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return;

      // ── Top border draws itself ──
      if (lineRef.current) {
        const el = lineRef.current;
        el.style.strokeDasharray = "1440";
        el.style.strokeDashoffset = "1440";

        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // ── Content fades up with stagger ──
      if (contentRef.current) {
        const children = contentRef.current.children;
        gsap.fromTo(children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-[var(--color-text)] py-12 px-6">
      {/* Drawn top border line */}
      <svg className="absolute top-0 left-0 w-full h-[2px] overflow-visible">
        <line
          ref={lineRef}
          x1="0" y1="1" x2="1440" y2="1"
          stroke="var(--color-signal)"
          strokeWidth="1"
          strokeOpacity="0.2"
          className="line-draw"
        />
      </svg>

      <div ref={contentRef} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
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
