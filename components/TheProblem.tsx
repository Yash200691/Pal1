"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TheProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const trigger = { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" };

      // Stat "1 in 3" — huge drop-in from top, overshoots slightly
      gsap.fromTo(statRef.current,
        { y: -120, opacity: 0, scale: 0.6, rotateX: -60 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.1, ease: "expo.out", scrollTrigger: trigger }
      );

      // Small headline badge
      gsap.fromTo(headRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", delay: 0.2, scrollTrigger: trigger }
      );

      // Quote slides in from left
      gsap.fromTo(quoteRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.4, scrollTrigger: trigger }
      );

      // Cards fly in from the right, staggered
      gsap.fromTo([card1Ref.current, card2Ref.current],
        { x: 120, opacity: 0, scale: 0.95 },
        {
          x: 0, opacity: 1, scale: 1,
          duration: 0.9, ease: "expo.out",
          stagger: 0.18,
          delay: 0.3,
          scrollTrigger: trigger
        }
      );

      // Floating ambient particle dots in background
      gsap.to(".prob-dot", {
        y: -18,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="the-problem"
      className="relative w-full bg-[var(--color-plum)] py-28 md:py-40 px-6 overflow-hidden"
    >
      {/* Ambient floating dots */}
      {[
        ["8%", "15%", 6], ["85%", "10%", 4], ["20%", "80%", 5], ["70%", "70%", 4],
        ["50%", "25%", 3], ["92%", "55%", 5], ["35%", "45%", 3],
      ].map(([l, t, s], i) => (
        <div
          key={i}
          className="prob-dot absolute rounded-full opacity-[0.06] bg-[var(--color-signal)]"
          style={{ left: l as string, top: t as string, width: s as number * 8, height: s as number * 8 }}
        />
      ))}

      {/* Glowing radial blob behind content */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-signal)] rounded-full blur-[180px] opacity-[0.07] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 md:gap-24 items-center">

        {/* LEFT: Stats */}
        <div className="flex flex-col" ref={statRef} style={{ perspective: "800px" }}>
          <div className="font-serif text-[96px] md:text-[120px] text-[var(--color-sun)] leading-none mb-2 select-none" style={{ textShadow: "0 0 80px rgba(245,166,35,0.35)" }}>
            1 in 3
          </div>
          <div ref={headRef}>
            <p className="font-sans text-[18px] md:text-[20px] text-white/80 mb-8 max-w-[420px] leading-relaxed">
              women in India experience domestic violence.
            </p>
            <p ref={quoteRef} className="font-sans italic text-[15px] md:text-[16px] text-white/50 max-w-[380px] leading-relaxed border-l-2 border-[var(--color-courage)]/40 pl-4">
              "The most common advice — 'just call the helpline' — fails in the exact moment it is needed most."
            </p>
          </div>
        </div>

        {/* RIGHT: Comparison Cards */}
        <div className="flex flex-col gap-6">
          {/* Card 1 */}
          <div ref={card1Ref} className="bg-white/[0.06] rounded-[16px] p-8">
            <h3 className="font-sans font-bold text-white/90 text-[15px] mb-5 flex items-center gap-3">
              <span className="inline-flex w-7 h-7 rounded-full bg-[var(--color-courage)]/20 border border-[var(--color-courage)]/40 items-center justify-center">
                <span className="text-[var(--color-courage)] text-[10px] font-bold">✕</span>
              </span>
              Why she cannot just call
            </h3>
            <ul className="flex flex-col gap-3.5">
              {["He is watching her phone", "He checks call logs and messages", "She has tried before — it made things worse", "She cannot speak — only act silently"].map((t, i) => (
                <li key={i} className="font-sans text-[14px] text-white/60 flex items-start gap-3 leading-relaxed">
                  <span className="text-[var(--color-courage)]/70 mt-[3px] shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div ref={card2Ref} className="bg-[var(--color-rescue)]/[0.08] border border-[var(--color-rescue)]/25 rounded-[16px] p-8">
            <h3 className="font-sans font-bold text-[var(--color-rescue)] text-[15px] mb-5 flex items-center gap-3">
              <span className="inline-flex w-7 h-7 rounded-full bg-[var(--color-rescue)]/20 border border-[var(--color-rescue)]/40 items-center justify-center">
                <span className="text-[var(--color-rescue)] text-[10px] font-bold">✓</span>
              </span>
              What Pal does instead
            </h3>
            <ul className="flex flex-col gap-3.5">
              {["Looks like a cooking app on her screen", "No call logs, no suspicious messages", "Three taps. Photo shared. SOS delivered.", "No sound, no visible action, no trace"].map((t, i) => (
                <li key={i} className="font-sans text-[14px] text-[var(--color-rescue)]/80 flex items-start gap-3 leading-relaxed">
                  <span className="mt-[3px] shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
