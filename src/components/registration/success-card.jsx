"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, PartyPopper, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

const COLORS = ["var(--primary)", "var(--accent)", "var(--violet)", "var(--success)"];

export function SuccessCard({ registration, onReset }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray(".spark").forEach((el, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = gsap.utils.random(90, 170);
        gsap.fromTo(
          el,
          { x: 0, y: 0, scale: 1, opacity: 1 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: 0,
            opacity: 0,
            duration: gsap.utils.random(0.9, 1.4),
            ease: "expo.out",
            delay: 0.35,
          }
        );
      });
    },
    { scope: ref }
  );

  const rows = [
    ["Name", registration.fullName],
    ["Designation", registration.designation],
    ["Mobile", `+91 ${registration.mobile}`],
    ["Email", registration.email],
    ["School", registration.schoolName],
    ["Board", registration.boardLabel],
  ];

  return (
    <div ref={ref} className="flex flex-col items-center py-4 text-center">
      <div className="relative mb-6 flex size-24 items-center justify-center">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="spark absolute size-2 rounded-full opacity-0"
            style={{ background: COLORS[i % COLORS.length] }}
          />
        ))}
        <motion.svg
          viewBox="0 0 96 96"
          className="size-24"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <circle cx="48" cy="48" r="44" fill="oklch(0.8 0.17 155 / 0.15)" stroke="var(--success)" strokeWidth="3" />
          <motion.path
            d="M30 49 L43 62 L67 36"
            fill="none"
            stroke="var(--success)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h2 className="font-display flex items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
          Registration Confirmed <PartyPopper className="size-6 text-accent" />
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you, {registration.fullName.split(" ")[0]}! Please keep your registration ID for future reference.
        </p>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          navigator.clipboard?.writeText(registration.regId);
          toast.success("Registration ID copied");
        }}
        className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-primary/60 bg-primary/10 px-6 py-3 cursor-pointer"
      >
        <span className="text-xs tracking-widest text-muted-foreground uppercase">Reg. ID</span>
        <span className="font-mono text-2xl font-bold text-primary">{registration.regId}</span>
        <Copy className="size-4 text-muted-foreground" />
      </motion.button>

      <motion.dl
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
        className="mt-8 w-full divide-y divide-border rounded-xl border border-border bg-background/30 text-left text-sm"
      >
        {rows.map(([k, v]) => (
          <motion.div
            key={k}
            variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
            className="flex gap-4 px-4 py-3"
          >
            <dt className="w-28 shrink-0 text-muted-foreground">{k}</dt>
            <dd className="font-medium break-words">{v}</dd>
          </motion.div>
        ))}
      </motion.dl>

      <Button variant="outline" className="mt-8" onClick={onReset}>
        <UserPlus /> Register another faculty
      </Button>
    </div>
  );
}