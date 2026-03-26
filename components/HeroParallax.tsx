"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroParallax() {
  const sectionRef   = useRef<HTMLElement>(null);
  const sceneRef     = useRef<HTMLDivElement>(null);

  // Individual layer refs – order = far→near
  const skyRef       = useRef<HTMLDivElement>(null);
  const sunRef       = useRef<HTMLDivElement>(null);
  const cloudsRef    = useRef<HTMLDivElement>(null);
  const birdsRef     = useRef<HTMLDivElement>(null);
  const mtFar1Ref    = useRef<HTMLDivElement>(null);
  const mtFar2Ref    = useRef<HTMLDivElement>(null);
  const mtMidRef     = useRef<HTMLDivElement>(null);
  const mtNearRef    = useRef<HTMLDivElement>(null);
  const hazeRef      = useRef<HTMLDivElement>(null);
  const builtRef     = useRef<HTMLDivElement>(null); // city + ground + woman together
  const particlesRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const h2Ref        = useRef<HTMLHeadingElement>(null);
  const h3Ref        = useRef<HTMLHeadingElement>(null);
  const pRef         = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      if (!sec) return;

      // ────────────────────────────────────────────────────────────────
      // SCROLL-DRIVEN PARALLAX  (each layer has its own scrub speed)
      // ────────────────────────────────────────────────────────────────
      const st = (el: React.RefObject<HTMLElement | null>, y: string, s = 0.8) =>
        gsap.to(el.current, {
          y, ease: "none",
          scrollTrigger: { trigger: sec, start: "top top", end: "bottom top", scrub: s },
        });

      st(skyRef,     "20%",  1.2);
      st(sunRef,     "60%",  1.4);
      st(cloudsRef,  "32%",  1.0);
      st(birdsRef,   "14%",  1.6);
      st(mtFar1Ref,  "25%",  0.9);
      st(mtFar2Ref,  "33%",  0.8);
      st(mtMidRef,   "45%",  0.7);
      st(mtNearRef,  "60%",  0.6);
      st(hazeRef,    "40%",  0.75);
      st(particlesRef,"52%", 0.65);
      st(builtRef,   "80%",  0.45);  // city + ground + woman – all move together
      st(textRef,    "-22%", 1.0);

      // text opacity out on scroll
      gsap.to(textRef.current, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: "38% top", scrub: true },
      });

      // ────────────────────────────────────────────────────────────────
      // MOUSE → 3D TILT (MetaMask signature effect)
      // ────────────────────────────────────────────────────────────────
      const handleMove = (e: MouseEvent) => {
        const r = sec.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;  // –0.5 … +0.5
        const y = (e.clientY - r.top)  / r.height - 0.5;

        gsap.to(sceneRef.current, {
          rotateY: x * 6, rotateX: -y * 4,
          duration: 0.85, ease: "power2.out",
          transformPerspective: 1000,
        });
        gsap.to(sunRef.current,    { x: x*28,  y: y*14,  duration: 1.4, ease: "power2.out" });
        gsap.to(cloudsRef.current, { x: x*16,  y: y*8,   duration: 1.6, ease: "power2.out" });
        gsap.to(mtFar1Ref.current, { x: x*10,            duration: 1.5, ease: "power2.out" });
        gsap.to(mtFar2Ref.current, { x: x*14,            duration: 1.3, ease: "power2.out" });
        gsap.to(mtMidRef.current,  { x: x*20,            duration: 1.1, ease: "power2.out" });
        gsap.to(mtNearRef.current, { x: x*28,            duration: 0.9, ease: "power2.out" });
        gsap.to(builtRef.current,  { x: x*-24, y: y*-10, duration: 0.8, ease: "power2.out" });
        gsap.to(particlesRef.current, { x: x*18, y: y*8, duration: 1.0, ease: "power2.out" });
      };
      const handleLeave = () => {
        gsap.to(sceneRef.current, { rotateY: 0, rotateX: 0, duration: 1.4, ease: "power3.out" });
        gsap.to([sunRef.current, cloudsRef.current, mtFar1Ref.current, mtFar2Ref.current,
                 mtMidRef.current, mtNearRef.current, builtRef.current, particlesRef.current],
          { x: 0, y: 0, duration: 1.5, ease: "power3.out" });
      };
      sec.addEventListener("mousemove", handleMove);
      sec.addEventListener("mouseleave", handleLeave);

      // ────────────────────────────────────────────────────────────────
      // ENTRANCE TIMELINE on page load
      // ────────────────────────────────────────────────────────────────
      gsap.set(skyRef.current, { scale: 1.12 });
      gsap.set([h2Ref.current, h3Ref.current, pRef.current, ctaRef.current], { y: 80, opacity: 0 });
      gsap.set(builtRef.current, { y: 60, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(skyRef.current, { scale: 1, duration: 2.4, ease: "expo.out" })
        .to(builtRef.current, { y: 0, opacity: 1, duration: 1.6, ease: "expo.out" }, 0.25)
        .to(h2Ref.current,   { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0.5)
        .to(h3Ref.current,   { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0.65)
        .to(pRef.current,    { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.80)
        .to(ctaRef.current,  { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.95);

      // ambient float for particles
      gsap.to(".hero-particle", {
        y: -14, duration: 2.8, ease: "sine.inOut",
        repeat: -1, yoyo: true,
        stagger: { each: 0.35, from: "random" },
      });

      // subtle cloud drift
      gsap.to(".cloud-shape", {
        x: "+=18", duration: 50, ease: "none",
        repeat: -1, yoyo: true,
        stagger: 8,
      });

      return () => {
        sec.removeEventListener("mousemove", handleMove);
        sec.removeEventListener("mouseleave", handleLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] overflow-hidden select-none"
      style={{ perspective: "900px" }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          PARALLAX SCENE – 10 independent layers
         ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={sceneRef}
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >

        {/* ── LAYER 1: SKY ── (slowest, most distant) */}
        <div
          ref={skyRef}
          className="absolute inset-0 w-full h-[130%] origin-top pointer-events-none"
          style={{
            background: "linear-gradient(170deg,#1a0838 0%,#3a1860 12%,#7040a0 28%,#c090c0 48%,#e8b8c0 66%,#f5d8c0 80%,#fae8d0 100%)",
            willChange: "transform",
          }}
        >
          {/* Stars — faint, pre-dawn */}
          {[
            [12,5,1.8],[28,3,2],[44,7,1.5],[61,4,2.2],[75,6,1.6],[88,2,2],[52,2,1.5],
            [20,10,1],[35,8,1.6],[68,9,1.2],[82,14,1.8],[8,15,1],[93,8,1.5],[48,13,1.2],
          ].map(([l,t,s],i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ left:`${l}%`, top:`${t}%`, width:s, height:s, opacity: 0.4+i*0.02 }} />
          ))}
        </div>

        {/* ── LAYER 2: SUN ── */}
        <div ref={sunRef} className="absolute top-[11%] right-[18%] pointer-events-none" style={{ willChange:"transform" }}>
          {/* Massive atmospheric halo rings */}
          <div className="absolute rounded-full bg-[#F5A623]" style={{ inset:-160, opacity:0.06, filter:"blur(90px)" }} />
          <div className="absolute rounded-full bg-[#F5A623]" style={{ inset:-90,  opacity:0.12, filter:"blur(55px)" }} />
          <div className="absolute rounded-full bg-[#FAC850]" style={{ inset:-40,  opacity:0.22, filter:"blur(24px)" }} />
          <div className="absolute rounded-full bg-[#FBD070]" style={{ inset:-16,  opacity:0.38, filter:"blur(10px)" }} />
          {/* Core */}
          <div className="w-[84px] h-[84px] rounded-full bg-[#F5A623]"
            style={{ boxShadow:"0 0 70px 18px rgba(245,166,35,.60), 0 0 140px 40px rgba(245,166,35,.25)" }} />
        </div>

        {/* ── LAYER 3: CLOUDS ── */}
        <div ref={cloudsRef} className="absolute inset-0 w-full h-[110%] pointer-events-none" style={{ willChange:"transform" }}>
          {/* Cloud 1 – large, left */}
          <div className="cloud-shape absolute" style={{ top:"10%", left:"6%" }}>
            <div className="relative w-[300px] h-[80px]">
              <div className="absolute inset-0 rounded-full bg-white/35 blur-[8px]" />
              <div className="absolute -top-5 left-[25%] w-[140px] h-[70px] rounded-full bg-white/28 blur-[8px]" />
              <div className="absolute -top-2 left-[55%] w-[100px] h-[55px] rounded-full bg-white/22 blur-[7px]" />
            </div>
          </div>
          {/* Cloud 2 – medium, right */}
          <div className="cloud-shape absolute" style={{ top:"22%", right:"6%", animationDelay:"-18s" }}>
            <div className="relative w-[220px] h-[60px]">
              <div className="absolute inset-0 rounded-full bg-white/28 blur-[7px]" />
              <div className="absolute -top-4 left-[30%] w-[110px] h-[55px] rounded-full bg-white/22 blur-[7px]" />
            </div>
          </div>
          {/* Cloud 3 – small, upper center */}
          <div className="cloud-shape absolute" style={{ top:"16%", left:"52%", animationDelay:"-35s" }}>
            <div className="relative w-[180px] h-[50px]">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-[6px]" />
              <div className="absolute -top-3 left-[20%] w-[90px] h-[45px] rounded-full bg-white/15 blur-[6px]" />
            </div>
          </div>
        </div>

        {/* ── LAYER 4: BIRDS ── */}
        <div ref={birdsRef} className="absolute inset-0 pointer-events-none" style={{ willChange:"transform" }}>
          <svg className="w-full h-[50%] absolute top-[5%]" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid meet">
            <g fill="none" stroke="#2D1B4E" strokeWidth="1.8" strokeLinecap="round" opacity="0.22">
              {/* Cluster 1 – upper left */}
              <path d="M 155,72 Q 165,64 175,72" /><path d="M 178,85 Q 188,77 198,85" /><path d="M 162,96 Q 172,88 182,96" />
              {/* Cluster 2 – center-high */}
              <path d="M 540,48 Q 552,40 564,48" /><path d="M 565,62 Q 577,54 589,62" /><path d="M 548,74 Q 558,66 568,74" /><path d="M 522,60 Q 530,53 538,60" />
              {/* Cluster 3 – upper right */}
              <path d="M 925,36 Q 937,28 949,36" /><path d="M 950,52 Q 962,44 974,52" />
              {/* Scatter */}
              <path d="M 1150,88 Q 1162,80 1174,88" /><path d="M 1168,102 Q 1178,94 1188,102" />
              <path d="M 285,125 Q 295,117 305,125" />
              <path d="M 755,145 Q 767,137 779,145" /><path d="M 775,160 Q 785,152 795,160" />
              <path d="M 1360,60 Q 1370,52 1380,60" />
            </g>
          </svg>
        </div>

        {/* ── LAYER 5: FAR MOUNTAINS #1 (most distant, very faint) ── */}
        <div ref={mtFar1Ref} className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ willChange:"transform" }}>
          <svg className="absolute bottom-[30%] w-full" height="400" preserveAspectRatio="none" viewBox="0 0 1440 400">
            {/* Sharp angular peaks – image-3 style */}
            <path
              d="M0,400 L0,280 L90,210 L180,260 L310,155 L430,225 L560,140 L680,215 L810,135 L930,210 L1060,148 L1180,218 L1300,158 L1440,210 L1440,400 Z"
              fill="#C8C0E8" fillOpacity="0.38"
            />
            <path
              d="M0,400 L0,330 L120,270 L240,315 L370,235 L490,295 L620,218 L740,290 L870,210 L990,280 L1110,225 L1230,292 L1370,240 L1440,278 L1440,400 Z"
              fill="#D0C8F0" fillOpacity="0.22"
            />
          </svg>
        </div>

        {/* ── LAYER 6: FAR MOUNTAINS #2 ── */}
        <div ref={mtFar2Ref} className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ willChange:"transform" }}>
          <svg className="absolute bottom-[26%] w-full" height="420" preserveAspectRatio="none" viewBox="0 0 1440 420">
            <path
              d="M0,420 L0,295 L100,225 L215,280 L345,185 L465,250 L590,168 L710,240 L840,162 L960,238 L1080,178 L1200,248 L1320,188 L1440,240 L1440,420 Z"
              fill="#B0A4D8" fillOpacity="0.50"
            />
            <path
              d="M0,420 L0,350 L130,288 L260,340 L395,258 L515,315 L645,242 L765,308 L895,238 L1015,305 L1145,252 L1270,318 L1440,270 L1440,420 Z"
              fill="#C8BEE8" fillOpacity="0.30"
            />
          </svg>
        </div>

        {/* ── LAYER 7: MID MOUNTAINS (sharp, saturated) ── */}
        <div ref={mtMidRef} className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ willChange:"transform" }}>
          {/* Golden horizon glow strip */}
          <div className="absolute bottom-[28%] w-full" style={{ height:60, background:"linear-gradient(to top, rgba(245,166,35,0.38), transparent)" }} />
          <svg className="absolute bottom-[24%] w-full" height="430" preserveAspectRatio="none" viewBox="0 0 1440 430">
            <path
              d="M0,430 L0,320 L85,248 L200,310 L330,215 L450,285 L575,198 L695,272 L825,188 L945,265 L1075,200 L1195,272 L1330,215 L1440,265 L1440,430 Z"
              fill="#9B88CC" fillOpacity="0.72"
            />
            <path
              d="M0,430 L0,368 L115,305 L240,360 L368,280 L488,342 L618,265 L738,335 L868,255 L988,325 L1118,270 L1248,338 L1368,282 L1440,320 L1440,430 Z"
              fill="#B0A0DC" fillOpacity="0.45"
            />
          </svg>
        </div>

        {/* ── LAYER 8: NEAR MOUNTAINS (dominant, dark violet) ── */}
        <div ref={mtNearRef} className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ willChange:"transform" }}>
          <svg className="absolute bottom-[20%] w-full" height="440" preserveAspectRatio="none" viewBox="0 0 1440 440">
            <path
              d="M0,440 L0,360 L80,288 L195,355 L320,262 L440,332 L568,248 L688,322 L820,235 L940,308 L1068,248 L1190,322 L1318,262 L1440,312 L1440,440 Z"
              fill="#7B68B8" fillOpacity="0.88"
            />
            <path
              d="M0,440 L0,400 L120,340 L250,398 L385,315 L505,378 L638,298 L758,368 L892,288 L1012,352 L1145,295 L1270,365 L1395,310 L1440,350 L1440,440 Z"
              fill="#9080C8" fillOpacity="0.52"
            />
          </svg>
        </div>

        {/* ── LAYER 9: ATMOSPHERIC HORIZON HAZE ── */}
        <div ref={hazeRef} className="absolute inset-x-0 bottom-0 w-full pointer-events-none" style={{ willChange:"transform" }}>
          <div className="absolute bottom-[18%] w-full h-[14%]"
            style={{ background:"linear-gradient(to top, rgba(200,160,120,0.28) 0%, rgba(245,200,160,0.10) 60%, transparent 100%)" }} />
        </div>

        {/* ── LAYER 10: FLOATING PARTICLES (marigolds + dust) ── */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" style={{ willChange:"transform" }}>
          {/* Marigold petal dots scattered */}
          {[
            [4,77,12,"#F5A623",0.8],[6,75.5,9,"#F5A623",0.65],[8,76.8,11,"#EFA020",0.75],
            [11,75,8,"#F5A623",0.55],[2,76,10,"#FAC050",0.60],
            [90,77,11,"#F5A623",0.75],[92,75.5,9,"#F5A623",0.65],[94,76.5,12,"#EFA020",0.80],
            [96,75,8,"#FAC050",0.55],[88,77.5,10,"#F5A623",0.60],
            [48,72,6,"#F5A623",0.30],[52,71,5,"#F5A623",0.25],[36,73,5,"#FAC050",0.20],
            [65,72.5,6,"#F5A623",0.25],[75,71.5,5,"#EFA020",0.22],
          ].map(([l,b,s,c,o], i) => (
            <div
              key={i}
              className="hero-particle absolute rounded-full"
              style={{ left:`${l}%`, bottom:`${b}%`, width:s as number, height:s as number, background:c as string, opacity:o as number }}
            />
          ))}
        </div>

        {/* ── LAYER 11: CITY GROUND + THE WOMAN ──────────────────────────
            IMPORTANT: woman is INSIDE this div so they move together →
            she can never float relative to the ground
           ─────────────────────────────────────────────────────────────── */}
        <div ref={builtRef} className="absolute inset-x-0 bottom-0 w-full" style={{ willChange:"transform" }}>

          {/* Ground base */}
          <div className="absolute bottom-0 w-full"
            style={{ height:"22%", background:"linear-gradient(to top, #c8a96e 0%, #d8bc84 55%, transparent 100%)" }} />

          {/* City silhouette – subtle, in the distance */}
          <svg className="absolute bottom-[18%] w-full" height="175" preserveAspectRatio="none" viewBox="0 0 1440 175">
            <g fill="#BE9888" fillOpacity="0.38">
              <rect x="0"    y="115" width="110" height="60" rx="2"/>
              <rect x="90"   y="82"  width="72"  height="93" rx="2"/>
              <rect x="172"  y="122" width="140" height="53" rx="2"/>
              <rect x="295"  y="48"  width="98"  height="127" rx="2"/>
              <rect x="380"  y="92"  width="138" height="83" rx="2"/>
              <rect x="508"  y="62"  width="80"  height="113" rx="2"/>
              <rect x="578"  y="110" width="125" height="65" rx="2"/>
              <rect x="690"  y="78"  width="94"  height="97" rx="2"/>
              <rect x="775"  y="28"  width="152" height="147" rx="2"/>
              <rect x="915"  y="105" width="115" height="70" rx="2"/>
              <rect x="1018" y="42"  width="122" height="133" rx="2"/>
              <rect x="1128" y="82"  width="138" height="93" rx="2"/>
              <rect x="1255" y="58"  width="84"  height="117" rx="2"/>
              <rect x="1332" y="88"  width="108" height="87" rx="2"/>
            </g>
          </svg>

          {/* Window lights */}
          {[[8,19],[14,19],[30,19],[33,17],[49,19],[67,17],[80,18],[89,17]].map(([l,b],i) => (
            <div key={i} className="absolute rounded-[1px]"
              style={{ left:`${l}%`, bottom:`${b+16}%`, width:4, height:5, background:"#F5A623", opacity:0.55, boxShadow:"0 0 6px 1px rgba(245,166,35,.4)" }} />
          ))}

          {/* ── THE WOMAN IMAGE – highly realistic transparent reference ── */}
          <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ width:220 }}>

            {/* Ground shadow */}
            <div className="absolute bottom-[-2%]" style={{ width:180, height:24, background:"rgba(60,20,10,0.35)", borderRadius:"100%", filter:"blur(12px)", left:20 }} />
            {/* Phone screen glow on ground */}
            <div className="absolute" style={{ bottom:"8%", left:"65%", width:80, height:80, background:"#1EBC8C", borderRadius:"100%", filter:"blur(48px)", opacity:0.25 }} />

            <img 
              src="/pal_woman_transparent.png" 
              alt="Indian Hero Woman" 
              className="w-[320px] drop-shadow-[0_24px_40px_rgba(30,10,60,0.45)] drop-shadow-[-10px_0px_20px_rgba(245,166,35,0.15)] relative z-10"
              style={{ objectFit: "contain", objectPosition: "bottom" }} 
            />
          </div>
          {/* end woman */}
        </div>
        {/* end builtRef (city + ground + woman) */}

      </div>
      {/* ═══════════════ end parallax scene ═══════════════ */}

      {/* ── TEXT OVERLAY (no parallax container) ── */}
      <div
        ref={textRef}
        className="absolute inset-0 z-20 flex flex-col justify-between px-6 md:px-10 pt-8 pb-0 max-w-7xl mx-auto w-full pointer-events-none"
        style={{ willChange:"transform, opacity" }}
      >
        {/* NAV */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
            <span className="font-devanagari text-[32px] text-[var(--color-signal)] leading-none drop-shadow"
              style={{ textShadow:"0 2px 12px rgba(107,63,192,.4)" }}>पल</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans font-bold text-[14px] text-[var(--color-courage)]">Pal</span>
              <span className="font-sans text-[11px] text-[var(--color-text)] opacity-50">A Moment That Saves a Life</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 pt-1">
            {[["How It Works","#how-it-works"],["Features","#features"],["For NGOs","#for-ngos"]].map(([l,h]) => (
              <Link key={h} href={h}
                className="font-sans text-[13px] text-[var(--color-text)] opacity-65 hover:opacity-100 transition-opacity duration-200">
                {l}
              </Link>
            ))}
          </nav>
        </div>

        {/* HEADLINE BLOCK */}
        <div className="w-full max-w-[520px] pb-[18vh] pointer-events-auto">
          <h2 ref={h2Ref}
            className="font-serif text-[46px] md:text-[58px] text-[var(--color-text)] leading-[1.10] mb-3"
            style={{ textShadow:"0 2px 20px rgba(255,240,235,.6)" }}>
            She couldn't call.
          </h2>
          <h3 ref={h3Ref}
            className="font-serif italic text-[22px] md:text-[28px] text-[var(--color-courage)] mb-6 leading-tight">
            So we built something<br/>she didn't have to.
          </h3>
          <p ref={pRef}
            className="font-sans text-[15px] md:text-[16px] text-[var(--color-text)] opacity-68 mb-8 leading-relaxed max-w-[440px]">
            Pal looks like a recipe app. Behind a secret gesture lies a life-saving system — silent, invisible, hers.
          </p>
          <Link
            ref={ctaRef}
            href="#how-it-works"
            className="inline-block bg-[var(--color-courage)] text-white font-sans font-bold text-[14px] px-8 py-4 rounded-full transition-all duration-200 hover:scale-[1.06] hover:shadow-[0_8px_36px_rgba(212,36,92,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-courage)]"
            aria-label="See how Pal works">
            See How Pal Works ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
