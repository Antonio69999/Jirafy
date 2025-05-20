import { ModeToggle } from "@/components/toggles/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Bell, CircleHelp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export function Header({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <header className={cn("w-full min-w-0 border-b border-border", className)}>
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <SearchBar />
          <h1 className="text-2xl font-bold truncate"></h1>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Button className="px-4 whitespace-nowrap">
            <Plus className="mr-2" /> {t("app.header.create")}
          </Button>
          <Button variant="ghost" className="w-8 h-9 p-1">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" className="w-8 h-9 p-1">
            <CircleHelp className="size-5" />
          </Button>
          <div className="flex items-center gap-4 shrink-0">
            <ModeToggle />
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="https://placehold.co/55x55/?text=PP"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
