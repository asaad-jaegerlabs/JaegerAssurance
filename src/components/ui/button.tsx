import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-xs font-medium tracking-wider uppercase transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/85 shadow-sm shadow-primary/20 border border-primary/30",
        destructive:
          "bg-critical-red-dim text-critical-red border border-critical-red/30 hover:bg-critical-red/20 hover:border-critical-red/50",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground hover:border-electric-blue/30",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-border",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline tracking-normal normal-case",
        tactical:
          "bg-tactical-green-dim text-tactical-green border border-tactical-green/30 hover:bg-tactical-green/20 hover:border-tactical-green/50 shadow-sm shadow-tactical-green/10",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5 text-[0.6875rem]",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
