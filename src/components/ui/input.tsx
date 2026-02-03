import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary/30 selection:text-foreground border-border/60 flex h-9 w-full min-w-0 rounded-sm border px-3 py-1 text-sm font-mono bg-card transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "hover:border-border",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
