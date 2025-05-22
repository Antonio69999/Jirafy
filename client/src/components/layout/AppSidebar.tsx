import {
  Calendar,
  Rocket,
  Settings,
  CircleUser,
  Users,
  Star,
  Workflow,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

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
    { title: t("app.sidebar.home"), url: "/", icon: CircleUser },
    { title: t("app.sidebar.recent"), url: "/?tab=viewed", icon: Clock },
    { title: t("app.sidebar.favourites"), url: "/?tab=starred", icon: Star },
    { title: t("app.sidebar.projects"), url: "/projects", icon: Rocket },
    { title: t("app.sidebar.teams"), url: "/teams", icon: Users },
    {
      title: t("app.sidebar.dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    { title: t("app.sidebar.workflows"), url: "/workflow", icon: Workflow },
    { title: t("app.sidebar.calendar"), url: "#", icon: Calendar },
    { title: t("app.sidebar.settings"), url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent className="py-6 px-3">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "flex items-center gap-2 mb-5",
              `theme-${colorTheme}`
            )}
          >
            <img src={logo} alt="Logo" className="rounded-md w-14" />
            <span className="text-lg font-semibold">Jirafy</span>
          </SidebarGroupLabel>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-muted-foreground/30"></div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
            <div className="h-px flex-1 bg-muted-foreground/30"></div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = () => {
                  if (item.url.startsWith("/?tab=")) {
                    return (
                      location.pathname === "/" &&
                      location.search === item.url.substring(1)
                    );
                  }

                  if (item.url === "/") {
                    return location.pathname === "/" && !location.search;
                  }

                  return location.pathname.startsWith(item.url.split("?")[0]);
                };

                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} style={{ textDecoration: "none" }}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "transition-colors",
                          `theme-${colorTheme}`,
                          "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                          isActive() ? "bg-[var(--active-bg)]" : ""
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
