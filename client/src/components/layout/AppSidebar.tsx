import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { colorTheme } = useColorThemeStore();
  const { t } = useTranslation();
  const location = useLocation();

  const items = [
    { title: t("app.sidebar.home"), url: "/", icon: Home },
    { title: t("app.sidebar.dashboard"), url: "/dashboard", icon: Inbox },
    { title: t("app.sidebar.calendar"), url: "#", icon: Calendar },
    { title: t("app.sidebar.statistics"), url: "#", icon: Search },
    { title: t("app.sidebar.settings"), url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent className="py-6 px-4">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "flex items-center gap-2 mb-6",
              `theme-${colorTheme}`
            )}
          >
            <img
              src="https://placehold.co/50x50/?text=Logo"
              alt="Logo"
              className="rounded-md"
            />
            <span className="text-lg font-semibold">Jirafy</span>
          </SidebarGroupLabel>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-muted-foreground/30"></div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
            <div className="h-px flex-1 bg-muted-foreground/30"></div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} style={{ textDecoration: "none" }}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "transition-colors",
                          `theme-${colorTheme}`,
                          "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                          isActive ? "bg-[var(--active-bg)]" : ""
                        )}
                      >
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="my-4 px-4">
        <hr className="border-muted-foreground/40" />
      </div>

      <SidebarFooter className=" py-4 px-4">
        <div className="text-sm text-muted-foreground">
          Jirafy © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
