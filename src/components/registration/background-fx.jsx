"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Deterministic particle positions (avoids hydration mismatch).
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 61.3) % 100,
  size: 2 + (i % 3),
}));

export function BackgroundFX() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".fx-blob").forEach((blob, i) => {
          gsap.to(blob, {
            x: "random(-120, 120)",
            y: "random(-90, 90)",
            scale: "random(0.85, 1.2)",
            duration: "random(10, 16)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: i * 0.6,
          });
        });
        gsap.to(".fx-particle", {
          opacity: "random(0.15, 0.9)",
          y: "random(-30, 30)",
          duration: "random(2.5, 5)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          stagger: { each: 0.12, from: "random" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.08_280)_0%,transparent_60%)]" />
      <div className="lab-grid absolute inset-0" />
      <div className="fx-blob absolute -top-32 -left-24 size-[480px] rounded-full bg-primary/25 blur-[120px]" />
      <div className="fx-blob absolute top-1/3 -right-40 size-[520px] rounded-full bg-violet/30 blur-[130px]" />
      <div className="fx-blob absolute -bottom-40 left-1/4 size-[420px] rounded-full bg-accent/15 blur-[120px]" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="fx-particle absolute rounded-full bg-primary/70"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: 0.3 }}
        />
      ))}
    </div>
  );
}
