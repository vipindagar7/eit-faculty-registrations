import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-background/40 px-3.5 py-2.5 text-[15px] shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
