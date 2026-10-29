"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ steps, current }) {
  const progress = (current / (steps.length - 1)) * 100;

  return (
    <div className="relative">
      <div className="absolute top-5 right-5 left-5 h-[2px] rounded-full bg-border" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute top-5 left-5 h-[2px] rounded-full bg-gradient-to-r from-primary to-accent"
        initial={false}
        animate={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <ol className="relative flex justify-between">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex w-20 flex-col items-center gap-2 text-center">
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-background text-primary shadow-[0_0_0_6px_oklch(0.82_0.15_195/0.15)]",
                  !done && !active && "border-border bg-background text-muted-foreground"
                )}
              >
                {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-[18px]" />}
              </motion.span>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  active || done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
