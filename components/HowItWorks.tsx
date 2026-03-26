"use client";

import { useEffect, useRef } from "react";
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

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Heading: word-by-word mask reveal
      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" }
        }
      );

      // Cards: alternating left/right fly-in, like MetaMask feature cards
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const fromLeft = i % 2 === 0;

        gsap.fromTo(card,
          { x: fromLeft ? -100 : 100, y: 40, opacity: 0, scale: 0.92, rotateY: fromLeft ? -12 : 12 },
          {
            x: 0, y: 0, opacity: 1, scale: 1, rotateY: 0,
            duration: 0.95, ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Subtle hover float on each card
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, scale: 1.025, boxShadow: "0 20px 60px rgba(107,63,192,0.18)", duration: 0.35, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, scale: 1, boxShadow: "0 4px 24px rgba(107,63,192,0.08)", duration: 0.4, ease: "power2.out" });
        });
      });

      // Background color transition as section enters view
      gsap.fromTo(sectionRef.current,
        { backgroundColor: "#0B1121" }, // from Navy
        {
          backgroundColor: "#1C3264", // to Blue
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

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="w-full py-28 md:py-40 px-6 overflow-hidden" style={{ backgroundColor: "#0B1121" }}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20 overflow-hidden">
          <p className="font-sans text-[13px] font-semibold text-[var(--color-rescue)] tracking-[0.12em] uppercase mb-4">How It Works</p>
          <h2 className="font-serif text-[42px] md:text-[52px] text-white/90 leading-tight">
            Six steps. Zero<br />trace. Completely hers.
          </h2>
        </div>

        {/* Cards Grid — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: "1200px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="relative bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-md cursor-default text-white"
              style={{
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.36)",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Ghosted step number */}
              <div className="absolute -top-2 -right-1 font-serif text-[88px] text-white/5 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-[36px] mb-5 leading-none">{step.icon}</div>
                <h3 className="font-serif text-[22px] text-white/90 mb-3 leading-snug">{step.title}</h3>
                <p className="font-sans text-[14px] text-white/60 leading-[1.75]">{step.desc}</p>
              </div>

              {/* Accent line at bottom */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full" style={{ background: "linear-gradient(to right, var(--color-signal), transparent)", opacity: 0.15 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
