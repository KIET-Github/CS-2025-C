import React from "react";

type GradientTextProps = {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
  animate?: boolean;
  className?: string;
};

export function GradientText({
  children,
  variant = "primary",
  animate = false,
  className = "",
}: GradientTextProps) {
  // Define gradient classes based on variant
  const variantGradients = {
    primary: "from-primary to-purple-500",
    secondary: "from-[hsl(270,50%,50%)] to-[hsl(330,60%,50%)]",
    accent: "from-[hsl(25,90%,50%)] to-[hsl(0,70%,50%)]",
    success: "from-green-400 to-emerald-600",
    warning: "from-yellow-400 to-orange-500",
    error: "from-red-500 to-rose-600",
  };

  return (
    <span
      className={`
        bg-clip-text 
        text-transparent 
        bg-gradient-to-r 
        ${variantGradients[variant]} 
        ${animate ? "animate-gradient-x bg-[length:200%_auto]" : ""} 
        ${className}
      `}
    >
      {children}
    </span>
  );
}
