"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  borderGradient?: boolean;
}

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      children,
      glowColor = "rgba(149, 128, 255, 0.6)",
      borderGradient = true,
      ...props
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    // Handle hydration
    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null;
    }

    const isDark = resolvedTheme === "dark";
    const bgColor = isDark
      ? "rgba(30, 30, 35, 0.7)"
      : "rgba(255, 255, 255, 0.8)";
    const shadowColor = isDark
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(149, 128, 255, 0.2)";

    return (
      <div
        ref={ref}
        style={{
          boxShadow: `0 10px 30px -10px ${shadowColor}`,
          backgroundColor: bgColor,
          backgroundImage: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)`,
        }}
        className={cn(
          "rounded-xl backdrop-blur-sm p-px transition-all duration-200 hover-scale animate-in",
          borderGradient && "gradient-border",
          className
        )}
        {...props}
      >
        <div className='p-6 rounded-[calc(var(--radius)-1px)] h-full'>
          {children}
        </div>
      </div>
    );
  }
);

GradientCard.displayName = "GradientCard";
