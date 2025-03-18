
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Button as ShadcnButton } from "@/components/ui/button";
import { motion } from "framer-motion";

// This component extends the Shadcn UI Button with additional animations
// and custom styling to match our design system

const buttonVariants = cva(
  "rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = "left",
    children,
    ...props 
  }, ref) => {
    // We're using the ShadcnButton as base and adding animations
    // and our custom styling on top
    if (asChild) {
      return (
        <ShadcnButton
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          asChild={asChild}
          {...props}
        >
          {children}
        </ShadcnButton>
      );
    }
    
    // Create a styled button without motion to avoid type conflicts
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          "transform transition-transform duration-200 active:scale-95 hover:scale-102",
          loading && "opacity-70 pointer-events-none"
        )}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            {icon && iconPosition === "left" && <span>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === "right" && <span>{icon}</span>}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "AnimatedButton";

export { Button, buttonVariants };
