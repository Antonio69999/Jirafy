import { ModeToggle } from "@/components/mode-toggle";
import { ColorThemeToggle } from "@/components/color-theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("w-full min-w-0 border-b border-border", className)}>
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold truncate"></h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ColorThemeToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
