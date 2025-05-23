import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export function PageContainer({
  title,
  children,
  className,
  compact = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto",
        compact ? "px-2 py-4" : "px-3 py-7",
        className
      )}
    >
      <h1
        className={cn(
          "font-extrabold tracking-tight",
          compact ? "text-2xl mb-3" : "text-3xl lg:text-4xl mb-5"
        )}
      >
        {title}
      </h1>

      {children}
    </div>
  );
}
