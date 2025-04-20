import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-border text-foreground bg-background shadow-sm [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        happy:
          "border-happy-200 bg-happy-100 text-happy-800 font-medium shadow-sm",
        sad:
          "border-sad-200 bg-sad-100 text-sad-800 font-medium shadow-sm",
        anxious:
          "border-anxious-200 bg-anxious-100 text-anxious-800 font-medium shadow-sm",
        productive:
          "border-productive-200 bg-productive-100 text-productive-800 font-medium shadow-sm",
        neutral:
          "border-neutral-200 bg-neutral-100 text-neutral-800 font-medium shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    (<Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />)
  );
}

export { Badge, badgeVariants }
