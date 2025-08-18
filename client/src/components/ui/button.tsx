import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium hover:shadow-strong hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medium hover:shadow-strong",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground hover:shadow-soft transition-all duration-200",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200",
        gradient:
          "bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white shadow-medium hover:shadow-glow hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300",
        glass:
          "glass text-foreground hover:bg-white/30 shadow-soft hover:shadow-medium backdrop-blur-md transition-all duration-200",
        modern:
          "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-glow hover:-translate-y-1 active:translate-y-0 transform transition-all duration-300 ease-out",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
