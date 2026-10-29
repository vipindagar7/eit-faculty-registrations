"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function ToggleGroup({ className, ...props }) {
  return (
    <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("flex flex-wrap gap-2", className)} {...props} />
  );
}

/** Pill-style option chip. Shows a tick when selected. */
function ToggleGroupItem({ className, children, ...props }) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "group inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-input bg-background/30 px-4 text-sm font-medium text-muted-foreground transition-all outline-none select-none",
        "hover:border-primary/50 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-foreground data-[state=on]:shadow-[0_0_18px_-6px_var(--primary)]",
        "aria-invalid:border-destructive/70",
        className
      )}
      {...props}
    >
      <Check className="hidden size-3.5 text-primary group-data-[state=on]:block" strokeWidth={3} />
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
