"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NightDawnParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phoneGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // SKY — barely moves
      gsap.to(skyRef.current, {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // CITY silhouette — mid speed
      gsap.to(cityRef.current, {
        y: "24%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // HANDS — enter from below, fast foreground
      gsap.fromTo(handsRef.current,
        { y: "60%", scale: 0.85, opacity: 0 },
        {
          y: "0%",
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 0.6,
          },
        }
      );

      // Phone glow pulsing
      gsap.to(phoneGlowRef.current, {
        scale: 1.35,
        opacity: 0.45,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // TEXT — fade in from below on entry
      gsap.fromTo(textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        }
      );

      // Mouse tracking for hands section
      const onMouseMove = (e: MouseEvent) => {
        const rect = sectionRef.current!.getBoundingClientRect();
        const xRel = (e.clientX - rect.left) / rect.width - 0.5;
        const yRel = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(handsRef.current, {
          x: xRel * -20,
          y: yRel * -10,
          duration: 0.8,
          ease: "power2.out",
        });
      };
      const onMouseLeave = () => {
        gsap.to(handsRef.current, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
      };

      sectionRef.current.addEventListener("mousemove", onMouseMove);
      sectionRef.current.addEventListener("mouseleave", onMouseLeave);

      return () => {
        sectionRef.current?.removeEventListener("mousemove", onMouseMove);
        sectionRef.current?.removeEventListener("mouseleave", onMouseLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[70vh] overflow-hidden bg-[#1A0A30]">
      {/* SKY */}
      <div
        ref={skyRef}
        className="absolute inset-0 w-full h-[150%]"
        style={{ background: "linear-gradient(to bottom, #0A0318 0%, #1A0A30 35%, #5A3080 65%, #D8D0F0 85%, #FAE0C8 100%)" }}
      >
        {/* Stars */}
        {[
          [20, 6], [70, 8], [50, 3], [15, 12], [82, 5], [60, 16], [38, 9], [90, 4], [45, 20]
        ].map(([l, t], i) => (
          <div key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${l}%`, top: `${t}%`, width: i % 2 === 0 ? 2 : 1.5, height: i % 2 === 0 ? 2 : 1.5, opacity: 0.55 + i * 0.03 }}
          />
        ))}
      </div>

      {/* CITY silhouette */}
      <div
        ref={cityRef}
        className="absolute inset-x-0 bottom-0 pointer-events-none"
      >
        <svg className="absolute bottom-0 w-full" height="180" preserveAspectRatio="none" viewBox="0 0 1440 180">
          <g fill="#2D1B4E">
            <rect x="0" y="120" width="120" height="60" rx="2" />
            <rect x="100" y="90" width="80" height="90" rx="2" />
            <rect x="190" y="130" width="150" height="50" rx="2" />
            <rect x="320" y="60" width="100" height="120" rx="2" />
            <rect x="400" y="100" width="140" height="80" rx="2" />
            <rect x="530" y="80" width="80" height="100" rx="2" />
            <rect x="610" y="120" width="120" height="60" rx="2" />
            <rect x="730" y="95" width="90" height="85" rx="2" />
            <rect x="820" y="40" width="150" height="140" rx="2" />
            <rect x="960" y="110" width="110" height="70" rx="2" />
            <rect x="1070" y="55" width="120" height="125" rx="2" />
            <rect x="1190" y="100" width="140" height="80" rx="2" />
            <rect x="1320" y="80" width="120" height="100" rx="2" />
          </g>
        </svg>
        {/* Lit window */}
        <div className="absolute bottom-[12%] left-[59%] w-[5px] h-[7px] bg-[#F5A623] opacity-90"
          style={{ boxShadow: "0 0 12px 4px rgba(245,166,35,0.7)" }} />
      </div>

      {/* HANDS */}
      <div
        ref={handsRef}
        className="absolute inset-0 flex justify-center items-end pb-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        {/* Screen glow bleeding upward */}
        <div
          ref={phoneGlowRef}
          className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[260px] h-[260px] bg-[#1EBC8C] rounded-full blur-[80px] opacity-30"
          style={{ willChange: "transform, opacity" }}
        />

        <svg className="w-[60%] max-w-[540px]" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Phone body center */}
          <rect x="180" y="60" width="140" height="260" rx="20" fill="#111111" />
          {/* Screen with Pal app UI */}
          <rect x="192" y="72" width="116" height="236" rx="12" fill="#1EBC8C" />
          {/* App interface hints */}
          <rect x="204" y="88" width="92" height="14" rx="4" fill="#0D5040" opacity="0.5" />
          <rect x="204" y="108" width="60" height="10" rx="3" fill="#0D5040" opacity="0.35" />
          <circle cx="250" cy="180" r="32" fill="#0D5040" opacity="0.45" />
          <rect x="204" y="232" width="92" height="28" rx="8" fill="#0D5040" opacity="0.4" />
          {/* Notch */}
          <rect x="230" y="68" width="40" height="8" rx="4" fill="#000" />

          {/* LEFT HAND holding phone */}
          <path d="M 60,420 Q 80,300 180,260 Q 200,255 200,275 Q 165,285 162,340 Q 178,342 178,365 Q 148,380 120,420 Z" fill="#C87850" />
          {/* Left thumb resting on screen */}
          <path d="M 180,265 C 170,248 166,240 185,245 C 200,240 195,260 180,265 Z" fill="#D4895E" />
          {/* Left finger bumps */}
          <path d="M 60,420 Q 76,355 110,300 L 95,420 Z" fill="#9B5840" opacity="0.35" />

          {/* RIGHT HAND holding phone */}
          <path d="M 440,420 Q 420,300 320,260 Q 300,255 300,275 Q 335,285 338,340 Q 322,342 322,365 Q 352,380 380,420 Z" fill="#C87850" />
          {/* Right thumb hovering over the screen — about to tap */}
          <path d="M 320,265 C 330,248 334,235 315,242 C 300,237 305,260 320,265 Z" fill="#D4895E" />
          {/* Right finger bumps */}
          <path d="M 440,420 Q 424,355 390,300 L 405,420 Z" fill="#9B5840" opacity="0.35" />
        </svg>
      </div>

      {/* TEXT OVERLAY */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ willChange: "transform, opacity" }}
      >
        <h2 className="font-serif text-[56px] md:text-[72px] text-white leading-none tracking-tight" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
          Three taps.
        </h2>
        <p className="font-sans text-[18px] md:text-[20px] text-white/65 mt-3" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
          That's all it takes.
        </p>
      </div>
    </section>
  );
}
