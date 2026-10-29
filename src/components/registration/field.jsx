"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Label + control + animated error/hint. Pass `icon` to render a leading icon (control needs pl-10). */
export function Field({ label, htmlFor, error, hint, icon: Icon, required, children, className, aside }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={htmlFor} className="block leading-snug">
            {label}
            {required && <span className="ml-1 text-accent">*</span>}
          </Label>
          {aside}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-[18px] -translate-y-1/2 text-muted-foreground" />
        )}
        {children}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key={error}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-[13px] font-medium text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[13px] text-muted-foreground"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
