import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { ArrowRight, Clock, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Project = {
  id: string;
  name: string;
  key: string;
  lastAccessed: string;
  starred?: boolean;
  color?: string;
};

export default function RecentProject() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // État pour les projets récents (vide par défaut)
  const [recentProjects] = useState<Project[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={`theme-${colorTheme}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">
          {t("home.recentProjects.title") || "Recent projects"}
        </h2>
        <Link
          to="/projects"
          className={cn(
            "text-xs text-muted-foreground flex items-center gap-1 transition-colors",
            `hover:text-[var(--theme-primary)] theme-${colorTheme}`
          )}
        >
          <span
            className={cn(
              "text-xs text-muted-foreground flex items-center gap-1 transition-colors",
              `hover:text-[var(--theme-primary)] theme-${colorTheme}`
            )}
          >
            {t("home.recentProjects.viewAll") || "View all projects"}
          </span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="bg-card rounded-md border shadow-sm p-3">
        <ScrollArea className="pb-1">
          {recentProjects.length > 0 ? (
            <div className="flex space-x-3 pb-1">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group rounded-md border bg-background hover:shadow-md transition-all flex-shrink-0 w-[200px]"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white font-medium text-xs"
                        style={{ backgroundColor: project.color || "#64748b" }}
                      >
                        {project.key.substring(0, 2)}
                      </div>
                      {project.starred && (
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>

                    <h3 className="font-medium text-sm mb-1 truncate">
                      {project.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(project.lastAccessed)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        aria-label={
                          t("home.recentProjects.open") || "Open project"
                        }
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t("home.recentProjects.noProjects") ||
                  "No recent projects found"}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                {t("home.recentProjects.createProject") ||
                  "Create a new project"}
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
