import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("container mx-auto px-6 py-8", className)}>
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
        {title}
      </h1>

      {children}
    </div>
  );
}
