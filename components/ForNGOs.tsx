"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Deploy in hours",
    desc: "No heavy installation. Web-based. Any NGO with a Telegram bot can activate Pal without a single line of server code.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "Live dashboard",
    desc: "Real-time GPS alerts, incident heatmap by city and district, status tracking. Built to help operators triage fast.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v8z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "Multilingual by default",
    desc: "Hindi, Marathi, English. More languages unlocked via the AI translation layer — ready to scale across India.",
  },
];

export default function ForNGOs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
      );

      // Cards burst up from below, staggered
      gsap.fromTo(cardRefs.current,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1, ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );

      // Icon wiggle on hover for each card
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const icon = card.querySelector(".ngo-icon");
        card.addEventListener("mouseenter", () => gsap.to(icon, { rotate: 8, scale: 1.15, duration: 0.3, ease: "back.out(2)" }));
        card.addEventListener("mouseleave", () => gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }));
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="for-ngos"
      className="relative w-full bg-[#E8E4F5] py-28 md:py-36 px-6 overflow-hidden"
    >
      {/* Decorative curved divider at top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden h-[60px] pointer-events-none">
        <svg className="absolute top-0 w-full" height="60" preserveAspectRatio="none" viewBox="0 0 1440 60">
          <path d="M0,0 L1440,0 L1440,30 Q720,80 0,30 Z" fill="#1A0A30" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-8">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20">
          <p className="font-sans text-[13px] font-semibold text-[var(--color-signal)] tracking-[0.12em] uppercase mb-4">For Organisations</p>
          <h2 className="font-serif text-[36px] md:text-[48px] text-[var(--color-plum)] leading-tight max-w-[600px] mx-auto">
            Built for the organisations who show up.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="bg-white rounded-[24px] p-10 flex flex-col items-start gap-6 cursor-default"
              style={{ boxShadow: "0 8px 40px rgba(107,63,192,0.08)" }}
            >
              <div className="ngo-icon text-[var(--color-signal)]">{item.icon}</div>
              <div>
                <h3 className="font-sans font-bold text-[18px] text-[var(--color-plum)] mb-3">{item.title}</h3>
                <p className="font-sans text-[14px] text-[var(--color-plum)] opacity-60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
