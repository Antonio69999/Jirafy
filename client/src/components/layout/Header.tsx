import { ModeToggle } from "@/components/toggles/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Bell, CircleHelp, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/authStore";
import CreateTaskModal from "../modals/CreateTaskModal";

export function Header({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Générer les initiales de l'utilisateur
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <>
      <header
        className={cn("w-full min-w-0 border-b border-border", className)}
      >
        <div className="w-full flex justify-between items-center p-4 py-2">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <SearchBar />
            <h1 className="text-2xl font-bold truncate"></h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              className={`px-4 whitespace-nowrap theme-${colorTheme}`}
              onClick={() => setIsCreateModalOpen(true)}
            >
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      "https://placehold.co/55x55/?text=" + initials
                    }
                    alt={user?.name || user?.email || "User Avatar"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`theme-${colorTheme}`}>
                <DropdownMenuLabel className="font-medium">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || t("app.header.userMenu.label")}
                    </p>
                    {user?.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-[var(--hover-bg)] focus:bg-[var(--hover-bg)] focus:text-foreground">
                  <User className="mr-2 h-4 w-4" />
                  {t("app.header.userMenu.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-[var(--hover-bg)] focus:bg-[var(--hover-bg)] focus:text-foreground"
                >
                  <Link to="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("app.header.userMenu.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[var(--hover-bg)] focus:bg-[var(--hover-bg)] focus:text-foreground"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {logoutMutation.isPending
                    ? t("app.header.userMenu.loggingOut", "Déconnexion...")
                    : t("app.header.userMenu.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Add the CreateModal component */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        colorTheme={colorTheme}
      />
    </>
  );
}
