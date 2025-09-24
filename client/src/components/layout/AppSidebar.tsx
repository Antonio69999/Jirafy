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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useProjects } from "@/hooks/useProject";

// Type pour les projets récents
type RecentProject = {
  id: string;
  name: string;
  key: string;
};

export function AppSidebar() {
  const { colorTheme } = useColorThemeStore();
  const { t } = useTranslation();
  const location = useLocation();

  // Récupération des projets récents
  const { data: projectsData, loading } = useProjects({
    per_page: 5, // Limiter aux 5 projets les plus récents
    order_by: "created_at",
    order_dir: "desc",
  });

  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  // Conversion des données API vers le format local
  useEffect(() => {
    if (projectsData?.data) {
      const convertedProjects: RecentProject[] = projectsData.data.map(
        (project) => ({
          id: String(project.id),
          name: project.name,
          key: project.key,
        })
      );
      setRecentProjects(convertedProjects);
    }
  }, [projectsData]);

  const items = [
    { title: t("app.sidebar.home"), url: "/", icon: CircleUser },
    { title: t("app.sidebar.recent"), url: "/?tab=viewed", icon: Clock },
    { title: t("app.sidebar.favourites"), url: "/?tab=starred", icon: Star },
    // Projet est défini ici mais implémenté séparément
    {
      title: t("app.sidebar.projects") || "Projects",
      url: "#",
      icon: Rocket,
      isDropdown: true,
    },
    { title: t("app.sidebar.teams"), url: "/teams", icon: Users },
    {
      title: t("app.sidebar.dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    { title: t("app.sidebar.workflows"), url: "/workflow", icon: Workflow },
    { title: t("app.sidebar.settings"), url: "/settings", icon: Settings },
  ];

  const isProjectActive = () => {
    return (
      location.pathname.startsWith("/projects") ||
      location.pathname === "/dashboard" ||
      recentProjects.some((project) =>
        location.pathname.includes(`/project/${project.id}`)
      )
    );
  };

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
              {/* Autres éléments du menu */}
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

                  if (
                    item.title === t("app.sidebar.projects") ||
                    item.title === "Projects"
                  ) {
                    return isProjectActive();
                  }

                  return location.pathname.startsWith(item.url.split("?")[0]);
                };

                if (item.isDropdown) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="w-full">
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={cn(
                                "transition-colors w-full",
                                `theme-${colorTheme}`,
                                "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                                isActive() ? "bg-[var(--active-bg)]" : ""
                              )}
                            >
                              <item.icon className="size-5" />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                            </SidebarMenuButton>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          className="w-52 p-2"
                          sideOffset={0}
                        >
                          <div className="space-y-2">
                            {/* Liste des projets récents */}
                            {loading ? (
                              <div className="px-2 py-3 text-center text-muted-foreground text-sm">
                                {t("app.common.loading") || "Chargement..."}
                              </div>
                            ) : recentProjects.length > 0 ? (
                              recentProjects.map((project) => (
                                <NavLink
                                  key={project.id}
                                  to={`/dashboard?project=${project.id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                                      "transition-colors",
                                      `theme-${colorTheme}`,
                                      "hover:bg-[var(--hover-bg)]",
                                      location.pathname === "/dashboard" &&
                                        location.search ===
                                          `?project=${project.id}`
                                        ? "bg-[var(--active-bg)]"
                                        : ""
                                    )}
                                  >
                                    <span className="truncate">
                                      {project.name}
                                    </span>
                                  </div>
                                </NavLink>
                              ))
                            ) : (
                              <div className="px-2 py-3 text-center text-muted-foreground text-sm">
                                {t("app.sidebar.noRecentProjects") ||
                                  "Aucun projet récent"}
                              </div>
                            )}

                            {/* Lien vers la page des projets */}
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
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }

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

      <SidebarFooter className="py-4 px-4">
        <div className="text-sm text-muted-foreground">
          Jirafy © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
