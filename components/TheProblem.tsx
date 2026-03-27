"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── 3D tilt utility ──────────────────────────────────────────
function useTilt(cardRef: React.RefObject<HTMLDivElement | null>) {
  const onMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 20, rotateX: -y * 20, translateZ: 8,
      duration: 0.35, ease: "power2.out",
    });
  }, [cardRef]);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateY: 0, rotateX: 0, translateZ: 0,
      duration: 0.6, ease: "power3.out",
    });
  }, [cardRef]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [cardRef, onMove, onLeave]);
}

// ── Countup utility ──────────────────────────────────────────
function useCountUp(ref: React.RefObject<HTMLDivElement | null>, target: number, suffix: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const duration = 1200;
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const current = Math.round(eased * target);
        el.textContent = `${current} in ${Math.round(eased * 3)}${suffix}`;
        if (t < 1) requestAnimationFrame(animate);
        else el.textContent = `1 in 3`;
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, target, suffix]);
}

export default function TheProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headingWordsRef = useRef<HTMLDivElement>(null);

  useTilt(card1Ref);
  useTilt(card2Ref);
  useCountUp(statRef, 1, "");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const trigger = { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" };

      // Word cascade on the heading text
      if (headingWordsRef.current) {
        const words = headingWordsRef.current.querySelectorAll(".word");
        gsap.fromTo(words,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.7, ease: "cubic-bezier(0.16, 1, 0.3, 1)", stagger: 0.06, scrollTrigger: trigger }
        );
      }

      // Stat — drops in from top with 3D perspective
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

      // Card 1 (LEFT): angeled entry from left
      gsap.fromTo(card1Ref.current,
        { x: -100, opacity: 0, rotate: -4, scale: 0.95 },
        {
          x: 0, opacity: 1, rotate: 0, scale: 1,
          duration: 0.95, ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: card1Ref.current, start: "top 88%", toggleActions: "play none none reverse" },
        }
      );

      // Card 2 (RIGHT): angled entry from right
      gsap.fromTo(card2Ref.current,
        { x: 100, opacity: 0, rotate: 4, scale: 0.95 },
        {
          x: 0, opacity: 1, rotate: 0, scale: 1,
          duration: 0.95, ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          delay: 0.08,
          scrollTrigger: { trigger: card2Ref.current, start: "top 88%", toggleActions: "play none none reverse" },
        }
      );

      // Per-row parallax depth on cards
      gsap.to(card1Ref.current, {
        y: () => -40,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to(card2Ref.current, {
        y: () => -70,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });

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

      {/* Decorative ring on parallax plane */}
      <div
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full border border-[var(--color-signal)]/10 pointer-events-none"
        data-parallax="-0.06"
        style={{ transform: `translateY(calc(var(--sy) * -0.06px))` }}
      />
      <div
        className="absolute bottom-[15%] left-[8%] w-[200px] h-[200px] rounded-full border border-[var(--color-courage)]/8 pointer-events-none"
        data-parallax="-0.09"
        style={{ transform: `translateY(calc(var(--sy) * -0.09px))` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 md:gap-24 items-center">

        {/* LEFT: Stats */}
        <div className="flex flex-col" style={{ perspective: "800px" }}>
          <div
            ref={statRef}
            className="font-serif text-[96px] md:text-[120px] text-[var(--color-sun)] leading-none mb-2 select-none"
            style={{ textShadow: "0 0 80px rgba(245,166,35,0.35)" }}
          >
            1 in 3
          </div>
          <div ref={headRef}>
            {/* Word cascade heading */}
            <div ref={headingWordsRef} className="overflow-hidden mb-8">
              <p className="font-sans text-[18px] md:text-[20px] text-white/80 max-w-[420px] leading-relaxed">
                {["women", "in", "India", "experience", "domestic", "violence."].map((word, i) => (
                  <span key={i} className="word inline-block overflow-hidden mr-[0.3em]" style={{ transitionDelay: `${i * 60}ms` }}>
                    {word}
                  </span>
                ))}
              </p>
            </div>
            <p ref={quoteRef} className="font-sans italic text-[15px] md:text-[16px] text-white/50 max-w-[380px] leading-relaxed border-l-2 border-[var(--color-courage)]/40 pl-4">
              "The most common advice — 'just call the helpline' — fails in the exact moment it is needed most."
            </p>
          </div>
        </div>

        {/* RIGHT: Comparison Cards */}
        <div className="flex flex-col gap-6" style={{ perspective: "800px" }}>
          {/* Card 1 */}
          <div ref={card1Ref} className="tilt-card bg-white/[0.06] rounded-[16px] p-8" data-parallax="-0.04">
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
          <div ref={card2Ref} className="tilt-card bg-[var(--color-rescue)]/[0.08] border border-[var(--color-rescue)]/25 rounded-[16px] p-8" data-parallax="-0.07">
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
