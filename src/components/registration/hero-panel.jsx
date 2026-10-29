"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { Lightbulb, Quote, ShieldCheck } from "lucide-react";
import { EVENT_NAME } from "@/lib/constants";
import { SITE } from "@/lib/site-config";

gsap.registerPlugin(useGSAP, MotionPathPlugin, DrawSVGPlugin);

// Ellipse paths (rx 120, ry 44) centred at 150,150 — rotated via group transforms.
const ORBIT = "M30,150 a120,44 0 1,0 240,0 a120,44 0 1,0 -240,0";

function Atom() {
  return (
    <svg viewBox="0 0 300 300" className="atom size-full overflow-visible">
      <defs>
        <radialGradient id="nucleus" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="oklch(0.95 0.1 90)" />
          <stop offset="60%" stopColor="oklch(0.84 0.16 85)" />
          <stop offset="100%" stopColor="oklch(0.6 0.18 50)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[0, 60, 120].map((deg, i) => (
        <g key={deg} transform={`rotate(${deg} 150 150)`}>
          <path
            id={`orbit-${i}`}
            d={ORBIT}
            fill="none"
            stroke="oklch(0.82 0.15 195 / 0.45)"
            strokeWidth="1.5"
            className="orbit-path"
          />
          <circle
            className={`electron electron-${i}`}
            r="6"
            fill={i === 1 ? "oklch(0.68 0.2 295)" : "oklch(0.82 0.15 195)"}
            filter="url(#glow)"
          />
        </g>
      ))}
      <circle className="nucleus" cx="150" cy="150" r="20" fill="url(#nucleus)" filter="url(#glow)" />
    </svg>
  );
}

export function HeroPanel() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          // Place electrons on their orbits either way.
          [0, 1, 2].forEach((i) => {
            gsap.set(`.electron-${i}`, {
              motionPath: { path: `#orbit-${i}`, align: `#orbit-${i}`, alignOrigin: [0.5, 0.5], start: i * 0.33, end: i * 0.33 },
            });
          });
          if (ctx.conditions.reduce) return;

          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
          tl.from(".orbit-path", { drawSVG: 0, scale: 0.4, opacity: 0, transformOrigin: "50% 50%", duration: 1.2, stagger: 0.12 })
            .from(".nucleus", { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(3)" }, "<0.2")
            .from(".hero-word", { yPercent: 110, duration: 0.9, stagger: 0.07 }, 0.15)
            .from(".tag-word", { y: 18, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.18, ease: "back.out(2)" }, 0.6)
            .from(".hero-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");

          [0, 1, 2].forEach((i) => {
            gsap.to(`.electron-${i}`, {
              motionPath: { path: `#orbit-${i}`, align: `#orbit-${i}`, alignOrigin: [0.5, 0.5], start: i * 0.33, end: i * 0.33 + 1 },
              duration: 4 + i * 1.3,
              ease: "none",
              repeat: -1,
            });
          });
          gsap.to(".atom", { rotation: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
          gsap.fromTo(
            ".nucleus",
            { scale: 1 },
            { scale: 1.12, duration: 1.4, delay: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 50%", immediateRender: false }
          );
          gsap.to(".float-chip", { y: -8, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.4 });
        }
      );
      return () => mm.revert();
    },
    { scope: ref }
  );

  const words = EVENT_NAME.split(" ");
  const tagline = ["Ideas.", "Insights.", "Innovation."];

  return (
    <section ref={ref} className="relative flex flex-col gap-7">
      <Image
        src="/logos/eit-ggsipu-logo.png"
        alt="Echelon Institute of Technology – Affiliated to Guru Gobind Singh Indraprastha University"
        width={1400}
        height={320}
        priority
        className="hero-fade h-auto w-full max-w-[420px]"
      />

      <div>
        <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight uppercase sm:text-5xl xl:text-[3.4rem]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
              <span className={`hero-word inline-block ${i >= words.length - 2 ? "text-gradient" : ""}`}>{w}</span>
            </span>
          ))}
        </h1>
        <p className="mt-4 flex flex-wrap gap-x-3 font-display text-xl font-semibold tracking-wide sm:text-2xl">
          {tagline.map((t, i) => (
            <span key={t} className={`tag-word inline-block ${["text-primary", "text-violet", "text-accent"][i]}`}>
              {t}
            </span>
          ))}
        </p>
      </div>

      <div className="hero-fade max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        <p className="text-lg font-semibold text-foreground sm:text-xl">
          Welcome to {SITE.institute}.
        </p>
        <p>
          Today is about exchanging perspectives, exploring new possibilities in science and technology and
          strengthening the connection between schools and higher education.
        </p>
        <p>
          Please complete the <span className="font-medium text-foreground">faculty registration form</span>{" "}
          <span className="lg:hidden">below</span>
          <span className="hidden lg:inline">alongside</span> before we begin the session.
        </p>
        <p>We look forward to meaningful conversations, fresh ideas and new opportunities for collaboration.</p>
      </div>

      <blockquote className="hero-fade relative max-w-xl rounded-2xl border border-primary/25 bg-primary/5 py-5 pr-5 pl-12 text-[15px] leading-relaxed italic text-foreground/90 sm:text-base">
        <Quote className="absolute top-5 left-4 size-5 rotate-180 text-accent" aria-hidden />
        The most meaningful progress in education begins when we come together to challenge ideas, share knowledge
        and shape what comes next.
      </blockquote>

      <div className="relative mx-auto hidden aspect-square w-full max-w-[280px] lg:block">
        <Atom />
        <div className="float-chip glass absolute top-4 -left-6 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium">
          <ShieldCheck className="size-4 text-success" /> OTP-secured
        </div>
        <div className="float-chip glass absolute -right-6 bottom-8 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium">
          <Lightbulb className="size-4 text-accent" /> 4 quick steps
        </div>
      </div>
    </section>
  );
}