import {
  Rocket,
  Settings,
  CircleUser,
  Users,
  Star,
  Workflow,
  LayoutDashboard,
  Clock,
  ChevronRight,
  FolderClosed,
  ArrowRight,
} from "lucide-react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { usePermissions } from "@/hooks/usePermissions";
import { useMemo, useEffect, useState } from "react";
import { useProjects } from "@/hooks/useProject";

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
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

type RecentProject = {
  id: string;
  name: string;
  key: string;
};

export function AppSidebar() {
  const { colorTheme } = useColorThemeStore();
  const { t } = useTranslation();
  const location = useLocation();

  const { canViewTeams, canViewDashboard, user } = usePermissions();

  const { data: projectsData, loading } = useProjects({
    per_page: user?.role === "customer" ? 100 : 5,
    order_by: "created_at",
    order_dir: "desc",
  });

  const isItemActive = (item: any) => {
    const basePath = item.url.split("?")[0];

    if (item.url === "/") {
      return location.pathname === "/" && !location.search;
    }

    if (item.url.startsWith("/?tab=")) {
      return (
        location.pathname === "/" &&
        location.search === item.url.replace("/", "")
      );
    }

    if (item.isDropdown) {
      return isProjectActive();
    }

    return location.pathname === basePath;
  };

  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    if (projectsData?.data) {
      setRecentProjects(
        projectsData.data.map((p) => ({
          id: String(p.id),
          name: p.name,
          key: p.key,
        }))
      );
    }
  }, [projectsData]);

  const isProjectActive = () => {
    return (
      location.pathname.startsWith("/projects") ||
      location.pathname === "/dashboard" ||
      location.pathname === "/my-tickets" ||
      recentProjects.some((project) =>
        location.pathname.includes(`/project/${project.id}`)
      )
    );
  };

  const items = useMemo(() => {
    const baseItems = [];

    if (user?.role === "customer") {
      return [
        {
          title: t("app.sidebar.myTickets") || "Mes Tickets",
          url: "/my-tickets",
          icon: CircleUser,
        },
        {
          title: t("app.sidebar.projects") || "Projects",
          url: "#",
          icon: Rocket,
          isDropdown: true,
        },
        {
          title: t("app.sidebar.settings") || "Paramètres",
          url: "/settings",
          icon: Settings,
        },
      ];
    }

    baseItems.push(
      { title: t("app.sidebar.home") || "Accueil", url: "/", icon: CircleUser },
      {
        title: t("app.sidebar.recent") || "Récents",
        url: "/?tab=viewed",
        icon: Clock,
      },
      {
        title: t("app.sidebar.favourites") || "Favoris",
        url: "/?tab=starred",
        icon: Star,
      },
      {
        title: t("app.sidebar.projects") || "Projects",
        url: "#",
        icon: Rocket,
        isDropdown: true,
      }
    );

    if (canViewDashboard()) {
      baseItems.push({
        title: t("app.sidebar.dashboard") || "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      });
    }

    if (canViewTeams()) {
      baseItems.push({
        title: t("app.sidebar.teams") || "Équipes",
        url: "/teams",
        icon: Users,
      });
    }

    baseItems.push({
      title: t("app.sidebar.workflows") || "Workflows",
      url: "/workflow",
      icon: Workflow,
    });

    baseItems.push({
      title: t("app.sidebar.settings") || "Paramètres",
      url: "/settings",
      icon: Settings,
    });

    return baseItems;
  }, [t, user]);

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
              {items.map((item) =>
                item.isDropdown ? (
                  /**  ---------------------------
                   *   SECTION COLLAPSIBLE PROJECTS
                   *  --------------------------- */
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isProjectActive()}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "transition-colors",
                            `theme-${colorTheme}`,
                            "hover:bg-[var(--hover-bg)]",
                            isProjectActive() ? "bg-[var(--active-bg)]" : ""
                          )}
                        >
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <div className="space-y-2 mt-2">
                            {/* Label pour clients */}
                            {user?.role === "customer" && (
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {t("customer.myProjects.title") ||
                                  "Mes projets"}
                              </div>
                            )}

                            {loading ? (
                              <div className="px-2 py-3 text-center text-muted-foreground text-sm">
                                {t("common.loading") || "Chargement..."}
                              </div>
                            ) : recentProjects.length > 0 ? (
                              recentProjects.map((project) => (
                                <NavLink
                                  key={project.id}
                                  to={
                                    user?.role === "customer"
                                      ? `/my-tickets?project=${project.id}`
                                      : `/dashboard?project=${project.id}`
                                  }
                                  style={{ textDecoration: "none" }}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                                      "transition-colors",
                                      `theme-${colorTheme}`,
                                      "hover:bg-[var(--hover-bg)]",
                                      location.search ===
                                        `?project=${project.id}`
                                        ? "bg-[var(--active-bg)]"
                                        : ""
                                    )}
                                  >
                                    <span className="text-xs font-mono text-muted-foreground">
                                      {project.key}
                                    </span>
                                    <span className="truncate">
                                      {project.name}
                                    </span>
                                  </div>
                                </NavLink>
                              ))
                            ) : (
                              <div className="px-2 py-3 text-center text-muted-foreground text-sm">
                                {user?.role === "customer"
                                  ? t("customer.noProjects") ||
                                    "Aucun projet associé"
                                  : t("app.sidebar.noRecentProjects") ||
                                    "Aucun projet récent"}
                              </div>
                            )}

                            {/* Voir tous les projets : interdit aux clients */}
                            {user?.role !== "customer" && (
                              <NavLink
                                to="/projects"
                                style={{ textDecoration: "none" }}
                              >
                                <div
                                  className={cn(
                                    "flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm",
                                    "transition-colors text-muted-foreground",
                                    `theme-${colorTheme}`,
                                    "hover:bg-[var(--hover-bg)] hover:text-foreground",
                                    location.pathname === "/projects"
                                      ? "bg-[var(--active-bg)] text-foreground"
                                      : ""
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <FolderClosed className="size-4" />
                                    <span>
                                      {t("home.recentProjects.viewAll") ||
                                        "Voir tous les projets"}
                                    </span>
                                  </div>
                                  <ArrowRight className="size-3.5" />
                                </div>
                              </NavLink>
                            )}
                          </div>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  /** ---------------------------
                   *  ITEMS NORMAUX
                   * --------------------------- */
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} style={{ textDecoration: "none" }}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          `theme-${colorTheme}`,
                          "hover:bg-[var(--hover-bg)] transition-colors",
                          isItemActive(item) ? "bg-[var(--active-bg)]" : ""
                        )}
                      >
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4 px-4">
        <div className="text-sm text-muted-foreground">
          Jirafy © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
