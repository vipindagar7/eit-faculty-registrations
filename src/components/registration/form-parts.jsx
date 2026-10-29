"use client";

import { motion } from "framer-motion";
import { Controller } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field } from "./field";

/** Stagger child variant used inside each step. */
export const item = { enter: { opacity: 0, y: 14 }, center: { opacity: 1, y: 0 } };

export function SectionTitle({ n, title, subtitle }) {
  return (
    <motion.div variants={item} className="space-y-1">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-accent">{n}</span>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      {subtitle && <p className="pl-8 text-sm text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

/**
 * Chip selector bound to react-hook-form.
 * type="single" → string value, type="multiple" → array value.
 */
export function ChoiceField({ control, name, label, options, type = "single", error, onValueChange, hint }) {
  return (
    <motion.div variants={item}>
      <Field label={label} required error={error} hint={hint}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <ToggleGroup
              type={type}
              value={field.value ?? (type === "multiple" ? [] : "")}
              onValueChange={(v) => {
                // Radix single mode emits "" when the active item is clicked again — keep the selection.
                if (type === "single" && !v) return;
                field.onChange(v);
                onValueChange?.(v);
              }}
              aria-label={label}
            >
              {options.map((o) => (
                <ToggleGroupItem key={o} value={o} aria-invalid={!!error}>
                  {o}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </Field>
    </motion.div>
  );
}
