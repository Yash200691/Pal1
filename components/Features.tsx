"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type EffortLevel = "Easy" | "Medium" | "Hard";
type Feature = { name: string; desc: string; effort: EffortLevel };

const featuresData: Record<string, Feature[]> = {
  "SOS Core": [
    { name: "Voice-to-Text Parsing", desc: "Captures faint or whispered speech and transcribes it instantly on-device. No server call required.", effort: "Medium" },
    { name: "Context AI Expansion", desc: "Expands 3–4 fragmented words into a complete, structured distress report in the user's own language.", effort: "Hard" },
    { name: "GPS Coordinate Lock", desc: "Silently captures the device's GPS coordinates and embeds them inside the SOS payload.", effort: "Easy" },
  ],
  "Stealth": [
    { name: "Image Steganography", desc: "Invisibly encodes the entire SOS payload — text, GPS, timestamp — inside any normal photo file.", effort: "Hard" },
    { name: "Triple-Tap Unlock", desc: "The app stays in disguise mode until the logo is tapped three times rapidly, revealing the real interface.", effort: "Easy" },
    { name: "Zero Footprint Session", desc: "No login, no cookies, no cache. The session is wiped after transmission. Nothing to find.", effort: "Medium" },
  ],
  "Trusted Circle": [
    { name: "Zero-Knowledge Routing", desc: "Alerts route to trusted contacts without storing any contact data or call logs on the local device.", effort: "Hard" },
    { name: "Offline Trusted Fallback", desc: "If NGO is unreachable, a pre-configured trusted friend receives the same decoded alert via Telegram.", effort: "Medium" },
  ],
  "Legal": [
    { name: "Cryptographic Timestamp", desc: "Every SOS log is signed with a verifiable hash, making it admissible as evidence in court.", effort: "Hard" },
    { name: "Auto-Wipe Protocol", desc: "The original photo and session data are deleted instantly after successful transmission.", effort: "Easy" },
  ],
  "Dashboard": [
    { name: "Telegram Bot Integration", desc: "NGOs receive real-time decoded alerts — full text, GPS link, and severity — directly in Telegram.", effort: "Medium" },
    { name: "Heatmap & Triage", desc: "Categorizes urgency and location for immediate operator response, with a live incident heatmap.", effort: "Hard" },
  ],
};

const tabs = Object.keys(featuresData);
const effortColor: Record<EffortLevel, string> = {
  Easy: "bg-[var(--color-rescue)] text-[#0A3028]",
  Medium: "bg-[var(--color-sun)] text-[#3A2800]",
  Hard: "bg-[var(--color-courage)] text-white",
};

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: headingRef.current, start: "top 82%", toggleActions: "play none none reverse" } }
      );

      gsap.fromTo(tabsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: tabsRef.current, start: "top 85%", toggleActions: "play none none reverse" }, delay: 0.2 }
      );

      // Floating ambient orbs
      gsap.to(".feat-orb", {
        y: -20, x: 10,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.6, from: "random" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards when tab changes
  useEffect(() => {
    if (!panelRef.current) return;
    const cards = panelRef.current.querySelectorAll(".feat-card");
    gsap.fromTo(cards,
      { y: 36, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "expo.out", stagger: 0.1 }
    );
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full bg-[#1A0A30] py-28 md:py-40 px-6 overflow-hidden"
    >
      {/* Ambient background orbs */}
      <div className="feat-orb absolute top-[10%] left-[5%] w-[320px] h-[320px] bg-[var(--color-signal)] rounded-full blur-[160px] opacity-[0.10] pointer-events-none" />
      <div className="feat-orb absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-[var(--color-courage)] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-14">
          <p className="font-sans text-[13px] font-semibold text-[var(--color-courage)] tracking-[0.12em] uppercase mb-4">Technical Features</p>
          <h2 className="font-serif text-[40px] md:text-[52px] text-white leading-tight">
            Every detail<br />designed for survival.
          </h2>
        </div>

        {/* Tab Buttons */}
        <div ref={tabsRef} className="flex flex-wrap justify-center gap-3 mb-14">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-2.5 rounded-full font-sans text-[13px] font-medium transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-courage)]
                ${activeTab === i
                  ? "bg-[var(--color-courage)] text-white shadow-[0_0_20px_rgba(212,36,92,0.35)]"
                  : "border border-white/15 text-white/45 hover:text-white hover:border-white/40"
                }`}
              aria-label={`View ${tab} features`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Panel */}
        <div
          ref={panelRef}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ minHeight: 260 }}
        >
          {featuresData[tabs[activeTab]].map((feature, i) => (
            <div
              key={`${activeTab}-${i}`}
              className="feat-card bg-white/[0.05] border border-white/[0.09] rounded-[20px] p-7 flex flex-col gap-4 hover:bg-white/[0.09] hover:border-white/20 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-sans font-bold text-[16px] text-white leading-snug">{feature.name}</h4>
                <span className={`shrink-0 font-sans text-[11px] font-bold px-3 py-1 rounded-full ${effortColor[feature.effort]}`}>
                  {feature.effort}
                </span>
              </div>
              <p className="font-sans text-[13px] text-white/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
          {/* Fill empty slots for visual balance */}
          {featuresData[tabs[activeTab]].length < 3 && Array(3 - featuresData[tabs[activeTab]].length).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:block" />
          ))}
        </div>

      </div>
    </section>
  );
}
