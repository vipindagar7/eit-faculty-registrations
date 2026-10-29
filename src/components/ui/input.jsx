import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-input bg-background/40 px-3.5 py-2 text-[15px] shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-secondary/40",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
