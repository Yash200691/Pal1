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

// ── 3D tilt ─────────────────────────────────────────────────
function attach3DTilt(el: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 20, rotateX: -y * 20, translateZ: 8,
      duration: 0.35, ease: "power2.out",
    });
    const inner = el.querySelector(".card-inner");
    if (inner) gsap.to(inner, { translateZ: 16, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(el, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 0.6, ease: "power3.out" });
    const inner = el.querySelector(".card-inner");
    if (inner) gsap.to(inner, { translateZ: 0, duration: 0.6, ease: "power3.out" });
  };
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

export default function ForNGOs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // ── Heading: word cascade ──
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".word");
        gsap.fromTo(words,
          { y: "110%", opacity: 0 },
          {
            y: "0%", opacity: 1,
            duration: 0.7, ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            stagger: 0.06,
            scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
        // Subheading
        const p = headingRef.current.querySelector("p");
        if (p) {
          gsap.fromTo(p,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", delay: 0.3,
              scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
          );
        }
      }

      // ── SVG divider: draw itself ──
      if (dividerRef.current) {
        const path = dividerRef.current;
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // ── Cards: angled entry ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        // Left/center/right pattern
        const positions = [
          { x: -100, rotate: -4 }, // left
          { x: 0, rotate: 0, y: 70, scale: 0.88 }, // center (rise)
          { x: 100, rotate: 4 }, // right
        ];
        const pos = positions[i] || positions[0];

        gsap.fromTo(card,
          { x: pos.x, opacity: 0, rotate: pos.rotate, scale: pos.scale || 0.95, y: pos.y || 0 },
          {
            x: 0, y: 0, opacity: 1, rotate: 0, scale: 1,
            duration: 0.95,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
          }
        );

        // 3D tilt
        cleanups.push(attach3DTilt(card));

        // Icon wiggle on hover for each card
        const icon = card.querySelector(".ngo-icon");
        const onEnter = () => gsap.to(icon, { rotate: 8, scale: 1.15, duration: 0.3, ease: "back.out(2)" });
        const onLeaveIcon = () => gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeaveIcon);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeaveIcon);
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanups.forEach(fn => fn());
    };
  }, []);

  const headingWords = ["Built", "for", "the", "organisations", "who", "show", "up."];

  return (
    <section
      ref={sectionRef}
      id="for-ngos"
      className="relative w-full bg-[#E8E4F5] py-28 md:py-36 px-6 overflow-hidden"
    >
      {/* Decorative curved divider at top — SVG line draw */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden h-[60px] pointer-events-none">
        <svg className="absolute top-0 w-full" height="60" preserveAspectRatio="none" viewBox="0 0 1440 60">
          <path d="M0,0 L1440,0 L1440,30 Q720,80 0,30 Z" fill="#1A0A30" />
          <path
            ref={dividerRef}
            d="M0,30 Q720,80 1440,30"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="2"
            strokeOpacity="0.25"
            className="line-draw"
          />
        </svg>
      </div>

      {/* Parallax ghost ring */}
      <div
        className="absolute top-[30%] right-[8%] w-[280px] h-[280px] rounded-full border border-[var(--color-plum)]/8 pointer-events-none"
        data-parallax="-0.06"
        style={{ transform: `translateY(calc(var(--sy) * -0.06px))` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto pt-8">

        {/* Heading — word cascade */}
        <div ref={headingRef} className="text-center mb-20">
          <p className="font-sans text-[13px] font-semibold text-[var(--color-signal)] tracking-[0.12em] uppercase mb-4">For Organisations</p>
          <h2 className="font-serif text-[36px] md:text-[48px] text-[var(--color-plum)] leading-tight max-w-[600px] mx-auto overflow-hidden">
            {headingWords.map((word, i) => (
              <span key={i} className="word inline-block overflow-hidden mr-[0.3em]" style={{ transitionDelay: `${i * 60}ms` }}>
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "800px" }}>
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="tilt-card bg-white rounded-[24px] p-10 flex flex-col items-start gap-6 cursor-default"
              style={{ boxShadow: "0 8px 40px rgba(107,63,192,0.08)" }}
            >
              <div className="card-inner flex flex-col items-start gap-6">
                <div className="ngo-icon text-[var(--color-signal)]">{item.icon}</div>
                <div>
                  <h3 className="font-sans font-bold text-[18px] text-[var(--color-plum)] mb-3">{item.title}</h3>
                  <p className="font-sans text-[14px] text-[var(--color-plum)] opacity-60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
