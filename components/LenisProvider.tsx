"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect Lenis to GSAP's ScrollTrigger so they sync
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global --sy variable for CSS parallax depth layers
    const root = document.documentElement;
    let syTicking = false;
    const updateSy = () => {
      if (!syTicking) {
        requestAnimationFrame(() => {
          root.style.setProperty("--sy", String(window.scrollY));
          syTicking = false;
        });
        syTicking = true;
      }
    };
    window.addEventListener("scroll", updateSy, { passive: true });
    updateSy();

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", updateSy);
    };
  }, []);

  return <>{children}</>;
}
