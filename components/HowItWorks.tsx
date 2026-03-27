"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: "She opens the app", desc: "The URL is bookmarked as 'Rasoi'. Anyone glancing at the screen sees a cooking website. The real interface is hidden behind a secret gesture — tap the logo three times.", icon: "📱", },
  { title: "She speaks or types", desc: "Even 3–4 words in Hindi, Marathi, or English. The browser transcribes her voice in real time. No account. No login.", icon: "🎤", },
  { title: "AI builds her message", desc: "Her fragment becomes a complete, structured distress message — in her own language, with GPS coordinates locked in. She can read and edit it before it goes anywhere.", icon: "✨", },
  { title: "It hides inside a photo", desc: "The message is invisibly encoded into any photo she chooses — a flower, a selfie, a food photo. Pixel-perfect. Invisible to any human observer.", icon: "🔒", },
  { title: "She shares the photo", desc: "She sends it as a document on Telegram. From the outside, she's just sharing a photo. No call log. No SMS. No trace.", icon: "📤", },
  { title: "NGO receives the alert", desc: "The Telegram bot decodes the image instantly. The NGO operator sees the full message, GPS map link, timestamp, and escalation status — in real time.", icon: "🛡️", },
];

const ROW_PARALLAX = [-0.04, -0.07, -0.10];

// ── 3D tilt on hover ─────────────────────────────────────────
function attach3DTilt(el: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 20, rotateX: -y * 20, translateZ: 8,
      duration: 0.35, ease: "power2.out",
    });
    // Inner content lifts
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

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // ── Heading: letter-spacing collapse ──
      if (headingRef.current) {
        const h2 = headingRef.current.querySelector("h2");
        if (h2) {
          gsap.fromTo(h2,
            { letterSpacing: "0.4em", opacity: 0 },
            {
              letterSpacing: "0.02em", opacity: 1,
              duration: 0.7, ease: "cubic-bezier(0.16, 1, 0.3, 1)",
              scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" },
            }
          );
        }
        // Subheading slide up
        const p = headingRef.current.querySelector("p");
        if (p) {
          gsap.fromTo(p,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", delay: 0.15,
              scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
          );
        }
      }

      // ── Cards: angled entry + 3D tilt hover + row-based parallax ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = i % 2 === 0;
        const row = Math.floor(i / 2);
        const pFactor = ROW_PARALLAX[Math.min(row, ROW_PARALLAX.length - 1)];

        // Angled entry
        gsap.fromTo(card,
          {
            x: isLeft ? -100 : 100,
            opacity: 0,
            rotate: isLeft ? -4 : 4,
            scale: 0.92,
          },
          {
            x: 0, opacity: 1, rotate: 0, scale: 1,
            duration: 0.95,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            delay: (i % 2) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Per-row parallax depth
        gsap.to(card, {
          y: () => pFactor * 1000 * -1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        // 3D tilt on hover
        cleanups.push(attach3DTilt(card));
      });

      // ── Accent line draw ──
      lineRefs.current.forEach((line) => {
        if (!line) return;
        const len = line.getBoundingClientRect().width || 200;
        line.style.strokeDasharray = String(len);
        line.style.strokeDashoffset = String(len);

        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: line.closest(".how-card"),
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Background color stays static as requested
      gsap.fromTo(sectionRef.current,
        { backgroundColor: "#FFF5F0" },
        {
          backgroundColor: "#FFF5F0",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanups.forEach(fn => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative w-full py-28 md:py-40 px-6 overflow-hidden" style={{ backgroundColor: "#FFF5F0" }}>
      {/* Decorative parallax orb */}
      <div
        className="absolute top-[5%] right-[12%] w-[250px] h-[250px] rounded-full bg-[var(--color-signal)] blur-[120px] opacity-[0.06] pointer-events-none"
        data-parallax="-0.05"
        style={{ transform: `translateY(calc(var(--sy) * -0.05px))` }}
      />
      <div
        className="absolute bottom-[10%] left-[5%] w-[180px] h-[180px] rounded-full border border-[var(--color-plum)]/8 pointer-events-none"
        data-parallax="-0.08"
        style={{ transform: `translateY(calc(var(--sy) * -0.08px))` }}
      />

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20 overflow-hidden">
          <p className="font-sans text-[13px] font-semibold text-[var(--color-courage)] tracking-[0.12em] uppercase mb-4">How It Works</p>
          <h2 className="font-serif text-[42px] md:text-[52px] text-[var(--color-plum)] leading-tight">
            Six steps. Zero<br />trace. Completely hers.
          </h2>
        </div>

        {/* Cards Grid — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: "800px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="how-card tilt-card relative bg-white rounded-[20px] p-8 cursor-default"
              style={{
                boxShadow: "0 4px 24px rgba(107,63,192,0.08)",
              }}
            >
              {/* Ghosted step number */}
              <div className="absolute -top-2 -right-1 font-serif text-[72px] text-[#E8E4F5] leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="card-inner relative z-10">
                {/* Icon */}
                <div className="text-[36px] mb-5 leading-none">{step.icon}</div>
                <h3 className="font-serif text-[22px] text-[var(--color-plum)] mb-3 leading-snug">{step.title}</h3>
                <p className="font-sans text-[14px] text-[var(--color-plum)]/60 leading-[1.75]">{step.desc}</p>
              </div>

              {/* Accent line - SVG draw */}
              <svg className="absolute bottom-0 left-8 right-8 h-[2px] overflow-visible" style={{ width: "calc(100% - 64px)" }}>
                <line
                  ref={(el) => { lineRefs.current[i] = el; }}
                  x1="0" y1="1" x2="100%" y2="1"
                  stroke="var(--color-signal)"
                  strokeWidth="2"
                  strokeOpacity="0.15"
                  className="line-draw"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
