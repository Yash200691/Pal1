"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Utilities for easing and math ---
export function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function progress(p: number, start: number, end: number) {
  return clamp((p - start) / (end - start), 0, 1);
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function CinematicScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force a ScrollTrigger refresh so components below calculate positions correctly
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);


    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
          
          const scrollY = -rect.top;
          let rawP = scrollY / maxScroll;
          setP(clamp(rawP, 0, 1));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // --- ACT 1: DARKNESS & DECOY PHONE (0.00 -> 0.18) ---
  const act1Progress = progress(p, 0.0, 0.18);
  const phoneScaleAct1 = act1Progress > 0.44 /* 0.08 overall */ ? 0.15 : 0.15; // At p=0.08, opacity changes, scale is constant
  const phoneOpacityAct1 = p >= 0.08 ? 1 : 0; // "blinks on suddenly"
  const act1TextOpacity = progress(p, 0.05, 0.10) - progress(p, 0.14, 0.16);
  
  // Progress hint line
  const hintLineHeight = lerp(0, 8, progress(p, 0.0, 0.08));

  // --- ACT 2: THE SECRET (0.18 -> 0.36) ---
  const act2Progress = progress(p, 0.18, 0.36);
  // Phone zooms toward screen: scale 0.15 -> 2.2 using easeInOut
  const phoneScaleAct2 = lerp(0.15, 2.2, easeInOut(act2Progress));
  const finalPhoneScale = p < 0.18 ? phoneScaleAct1 : phoneScaleAct2;

  // Background transition: #0D0820 -> #1A0A30 (from Act 2 to Act 3)
  // Actually the prompt says background lightens from #0D0820 -> #1A0A30 starting around 0.18 to 0.24
  
  // UI Swap at 0.26
  const isRealPalUI = p >= 0.26;

  // Floating text "Three taps..."
  const act2TextOpacity = progress(p, 0.20, 0.24) - progress(p, 0.30, 0.34);

  // --- ACT 3: THE FACE (0.36 -> 0.54) ---
  const act3Progress = progress(p, 0.36, 0.54);
  const phoneUIOpacity = 1 - progress(p, 0.36, 0.38); // phone UI fades out
  
  // Face animation: starts large(1.3) and invisible(0), settles(1.0) and solid(1) at 0.42
  const faceEntry = progress(p, 0.36, 0.42);
  const faceScale = lerp(1.3, 1.0, easeInOut(faceEntry));
  const faceOpacity = lerp(0, 1.0, faceEntry);
  
  // Floating text "1 in 3"
  const act3TextOpacity = progress(p, 0.40, 0.44) - progress(p, 0.50, 0.52);

  // --- ACT 4: THE PULL-BACK (0.54 -> 0.72) ---
  const act4Progress = progress(p, 0.54, 0.72);
  
  // The face shrinks to 0.25, transforms down 30vh, fades to 0.3 at 0.54...
  // Wait, the prompt says "At progress 0.54: scale(0.9), opacity fades to 0.3 — begins pulling back"
  // Let's smoothly calculate face scale / translate.
  const faceFinalScale = p < 0.54 ? faceScale : lerp(0.9, 0.25, easeInOut(act4Progress));
  const faceTranslateY = p < 0.54 ? 0 : lerp(0, 30, easeInOut(act4Progress));
  
  // Dawn landscape assembles
  const mount1Y = lerp(40, 0, easeInOut(act4Progress));
  const buildDawnOpacity = easeInOut(act4Progress);
  
  // Sun rises
  const sunProgress = progress(p, 0.54, 0.68);
  const sunY = lerp(120, 0, easeInOut(sunProgress));

  // Floating text "She couldn't call"
  const act4TextOpacity = progress(p, 0.58, 0.62) - progress(p, 0.68, 0.70);

  // --- ACT 5: THE DAWN (0.72 -> 1.00) ---
  const act5Progress = progress(p, 0.72, 1.0);
  const finalSequenceOpacity = progress(p, 0.75, 0.85);

  if (!mounted) {
    return <section className="w-full h-[500vh] bg-[var(--color-danger)]" />;
  }

  // Dynamic Backgrounds
  // 0 -> 0.36: Danger (#0D0820)
  // 0.36 -> 0.54: lerp Danger -> Plum (#2D1B4E)
  return (
    <section ref={containerRef} className="relative w-full h-[500vh] bg-[var(--color-danger)]">
      
      {/* PROGRESSIVE NAVIGATION HEADER */}
      <nav 
        className="fixed top-0 left-0 right-0 h-[80px] z-[100] flex items-center justify-between px-6 md:px-12 transition-all duration-500 will-change-transform"
        style={{
          backgroundColor: p > 0.72 ? "rgba(250,224,200,0.92)" : "transparent",
          backdropFilter: p > 0.72 ? "blur(12px)" : "none",
          WebkitBackdropFilter: p > 0.72 ? "blur(12px)" : "none",
          borderBottom: p > 0.72 ? "1px solid rgba(45,27,78,0.05)" : "1px solid transparent"
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-devanagari text-[28px] text-[var(--color-signal)] leading-none">पल</span>
          <span className="font-sans text-[13px] font-bold text-[var(--color-courage)] uppercase tracking-[0.1em] mt-1">Pal</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "Features", "For NGOs"].map((text, i) => (
            <a 
              key={i} 
              href={`#${text.toLowerCase().replace(/ /g, "-")}`}
              className="font-sans text-[13px] font-medium transition-colors hover:opacity-100"
              style={{ color: p > 0.72 ? "var(--color-plum)" : "rgba(255,255,255,0.8)" }}
            >
              {text}
            </a>
          ))}
        </div>
      </nav>

      {/* STICKY STAGE */}
      <div className="sticky top-0 w-full h-[100vh] overflow-hidden flex items-center justify-center bg-[var(--color-danger)]">
        
        {/* LAYER 0: Background Fades */}
        {/* Plum Background (Act 3) */}
        <div 
          className="absolute inset-0 bg-[var(--color-plum)] pointer-events-none transition-opacity duration-0"
          style={{ opacity: lerp(0, 1, easeInOut(progress(p, 0.36, 0.54))) }}
        />
        {/* Dawn Sky Background (Act 4-5) */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-dawn)] to-[#E6C6D6] pointer-events-none transition-opacity duration-0"
          style={{ opacity: lerp(0, 1, buildDawnOpacity) }}
        />

        {/* ACT 1: Floating Text */}
        <div 
          className="absolute top-[20%] font-serif italic text-[18px] text-white/40 tracking-[0.08em] pointer-events-none transition-opacity duration-0 z-40"
          style={{ opacity: act1TextOpacity }}
        >
          She can't call.
        </div>

        {/* ACT 1: Progress Hint */}
        <div 
          className="absolute bottom-10 flex flex-col items-center justify-end z-40 transition-opacity duration-300"
          style={{ height: '8vh', opacity: p < 0.15 ? 1 : 0 }}
        >
          <div className="w-[2px] bg-[var(--color-signal)]/20" style={{ height: `${hintLineHeight}vh` }} />
          <div className="mt-2 font-sans text-[11px] text-white/30 animate-bounce">↓</div>
        </div>

        {/* ACT 2: Floating Text */}
        <div 
          className="absolute top-[18%] font-serif text-[20px] text-white pointer-events-none transition-opacity duration-0 z-40"
          style={{ opacity: act2TextOpacity }}
        >
          Three taps. The real Pal appears.
        </div>

        {/* PHONE ENGINE (Act 1 & 2) */}
        <div 
          className="absolute z-20 flex items-center justify-center will-change-transform"
          style={{ 
            transform: `scale(${finalPhoneScale})`, // Wait, phone doesn't translate. Only face translates later.
            opacity: phoneOpacityAct1 * phoneUIOpacity, // phoneUIOpacity fades it out in Act 3
            transition: p < 0.08 ? "none" : "opacity 200ms ease"
          }}
        >
          {/* Phone Frame */}
          <div 
            className="relative w-[160px] h-[280px] rounded-[24px] border-[4px] border-[#2A2A35] bg-black overflow-hidden transition-shadow duration-1000"
            style={{ 
              boxShadow: isRealPalUI 
                ? "0 0 120px rgba(30,188,140,0.4), 0 0 40px rgba(30,188,140,0.6)" 
                : "0 0 60px rgba(245,166,35,0.15)"
            }}
          >
            {/* Decoy UI */}
            <div 
              className="absolute inset-0 bg-[#FFFDF9] flex flex-col will-change-opacity pointer-events-none"
              style={{ opacity: isRealPalUI ? 0 : 1, transition: "opacity 600ms ease" }}
            >
              <div className="h-6 w-full bg-[#E5733F] flex items-center justify-center">
                <span className="font-sans text-[7px] text-white tracking-widest font-semibold">Rasoi — रसोई</span>
              </div>
              <div className="flex-1 p-3 flex flex-col gap-2.5">
                <div className="w-full h-[70px] bg-[var(--color-earth)]/30 rounded-md"></div>
                <div className="w-3/4 h-2 bg-gray-200 rounded-full mt-1"></div>
                <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
                <div className="mt-auto w-full h-[22px] bg-gray-100 rounded-full border border-gray-200"></div>
              </div>
            </div>

            {/* Pal Real UI */}
            <div 
              className="absolute inset-0 bg-[#060A0C] flex flex-col items-center pt-8 will-change-opacity pointer-events-none"
              style={{ opacity: isRealPalUI ? 1 : 0, transition: "opacity 600ms ease" }}
            >
              <div className="font-devanagari text-[14px] text-[var(--color-rescue)] mb-10 tracking-widest">पल</div>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-rescue)] shadow-[0_0_8px_rgba(30,188,140,1)] mb-4 animate-pulse"></div>
              <div className="font-sans text-[8px] text-[var(--color-rescue)] opacity-70 mb-10 tracking-widest">बोलिए... <span className="animate-pulse">|</span></div>
              
              <div className="relative w-[40px] h-[40px] rounded-full bg-[var(--color-courage)] flex items-center justify-center shadow-[0_0_15px_rgba(212,36,92,0.6)]">
                <div className="absolute inset-0 rounded-full border border-[var(--color-courage)] animate-ping opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* DAWN LANDSCAPE (Act 4) */}
        {/* Sun */}
        <div 
          className="absolute z-0 flex items-center justify-center will-change-transform pointer-events-none"
          style={{ 
            opacity: buildDawnOpacity,
            transform: `translateY(${sunY}vh)`,
            bottom: '25%'
          }}
        >
          <div className="relative w-[96px] h-[96px] rounded-full bg-[var(--color-sun)] shadow-[0_0_180px_rgba(245,166,35,0.3)]"></div>
        </div>

        {/* Mountains */}
        <div className="absolute bottom-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none" style={{ opacity: buildDawnOpacity }}>
          {/* Layer 1 (Far) */}
          <svg className="absolute bottom-0 w-[120%] -left-[10%] h-[60%] will-change-transform" style={{ transform: `translateY(${mount1Y * 0.8}vh)`, opacity: 0.5 }} preserveAspectRatio="none" viewBox="0 0 1000 200">
            <path d="M0,200 L0,100 L150,50 L300,120 L500,20 L750,140 L1000,60 L1000,200 Z" fill="#9B91CC" />
          </svg>
          {/* Layer 2 (Mid) */}
          <svg className="absolute bottom-0 w-[110%] -left-[5%] h-[50%] will-change-transform" style={{ transform: `translateY(${mount1Y * 0.5}vh)`, opacity: 0.7 }} preserveAspectRatio="none" viewBox="0 0 1000 200">
            <path d="M0,200 L0,120 L250,60 L450,140 L700,40 L1000,100 L1000,200 Z" fill="#7B70B8" />
          </svg>
          {/* Layer 3 (Near) */}
          <svg className="absolute bottom-0 w-full left-0 h-[40%] will-change-transform" style={{ transform: `translateY(${mount1Y * 0.2}vh)`, opacity: 0.85 }} preserveAspectRatio="none" viewBox="0 0 1000 200">
            <path d="M0,200 L0,140 L350,70 L600,150 L850,50 L1000,120 L1000,200 Z" fill="#5A5090" />
          </svg>
        </div>

        {/* Birds */}
        <div className="absolute top-[20%] w-full h-[20vh] z-0 pointer-events-none" style={{ opacity: buildDawnOpacity }}>
          {[...Array(8)].map((_, i) => (
             <svg key={i} className="absolute w-[24px] h-[24px] opacity-25" style={{
               left: `${40 + (i * 8)}%`,
               top: `${30 - (i * 3)}%`,
               transform: `translate(${lerp(0, (i%2 === 0 ? 50 : -50), easeInOut(act4Progress))}px, ${lerp(0, -20, easeInOut(act4Progress))}px)`
             }} viewBox="0 0 24 24">
               <path d="M2,12 Q6,8 12,12 Q18,8 22,12 Q18,10 12,14 Q6,10 2,12 Z" fill="#2D1B4E" />
             </svg>
          ))}
        </div>

        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full h-[15vh] bg-[var(--color-earth)] z-10 pointer-events-none"
          style={{ opacity: progress(p, 0.60, 0.70) }}
        >
          {/* Marigold clusters */}
          <div className="absolute top-2 left-[20%] w-3 h-3 bg-[var(--color-sun)] rounded-full blur-[1px]"></div>
          <div className="absolute top-4 left-[22%] w-2 h-2 bg-[var(--color-sun)] rounded-full blur-[1px]"></div>
          
          <div className="absolute top-1 right-[30%] w-4 h-3 bg-[var(--color-sun)] rounded-full blur-[1px]"></div>
        </div>

        {/* ACT 3 & 4: THE FACE AND BODY */}
        <div 
          className="absolute z-10 flex flex-col items-center justify-start will-change-transform pointer-events-none"
          style={{
             opacity: faceOpacity * lerp(1.0, 0.8, easeInOut(act4Progress)),
             transform: `scale(${faceFinalScale}) translateY(${faceTranslateY}vh)`,
             transformOrigin: '50% 25%', // Pivots scaling firmly centering on her face
             width: '600px',
             height: '1000px',
             willChange: 'transform, opacity'
          }}
        >
          {/* Subtle warm radial glow behind her head */}
          <div 
            className="absolute top-[100px] w-[300px] h-[300px] rounded-full bg-[var(--color-sun)] pointer-events-none"
            style={{ filter: "blur(60px)", opacity: lerp(0.08, 0, act4Progress) }}
          />

          <Image 
            src="/pal_woman_transparent.png" 
            alt="Pal Woman Portrait" 
            width={600}
            height={1000}
            priority
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* ACT 3: Floating Text */}
        <div 
          className="absolute z-40 flex flex-col items-center pointer-events-none transition-opacity duration-0"
          style={{ opacity: act3TextOpacity, top: '65%' }}
        >
          <div className="font-serif text-[64px] text-white leading-none mb-2" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            1 in 3.
          </div>
          <div className="font-sans italic text-[18px] text-white/60">
            She is your neighbour.
          </div>
        </div>

        {/* ACT 4: Floating Text */}
        <div 
          className="absolute z-50 flex flex-col items-start pointer-events-none transition-opacity duration-0"
          style={{ opacity: act4TextOpacity, left: '10vw', top: '40%' }}
        >
          <div className="font-serif text-[52px] text-[var(--color-plum)] leading-tight mb-2">
            She couldn't call.
          </div>
          <div className="font-serif italic text-[28px] text-[var(--color-courage)]">
            So she tapped.
          </div>
        </div>

        {/* ACT 5: Final Dawn Reveal */}
        <div 
          className="absolute z-50 flex flex-col items-center pointer-events-none transition-opacity duration-0"
          style={{ opacity: finalSequenceOpacity, top: '25%' }}
        >
          <div className="font-serif text-[72px] text-[var(--color-plum)] leading-none mb-4 flex items-center gap-4">
            Pal <span className="font-devanagari">— पल</span>
          </div>
          <div className="font-sans text-[20px] text-[var(--color-courage)] mb-2">
            A Moment That Saves a Life.
          </div>
          <div className="font-sans text-[14px] text-[var(--color-plum)]/50 tracking-[0.15em] uppercase mb-12">
            Discreet. Silent. Hers.
          </div>
          
          {/* CTA Button */}
          <button className="px-[36px] py-[16px] bg-[var(--color-courage)] text-white font-sans text-[14px] font-bold rounded-[50px] shadow-[0_8px_24px_rgba(212,36,92,0.3)] pointer-events-auto hover:scale-105 transition-transform">
            See How It Works →
          </button>
        </div>
      </div>
    </section>
  );
}
