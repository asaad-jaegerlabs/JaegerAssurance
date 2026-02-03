import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-[0.6875rem] font-medium font-mono tracking-wider uppercase w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-electric-blue/30 bg-electric-blue-dim text-electric-blue",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        destructive:
          "border-critical-red/30 bg-critical-red-dim text-critical-red",
        outline:
          "text-foreground border-border",
        success:
          "border-tactical-green/30 bg-tactical-green-dim text-tactical-green",
        warning:
          "border-warning-amber/30 bg-warning-amber-dim text-warning-amber",
        info:
          "border-info-cyan/30 bg-info-cyan-dim text-info-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
