import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    key: string;
    description: string;
    color: string;
    lead: string;
  };
  colorTheme: string;
}

export function ProjectHeader({ project, colorTheme }: ProjectHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 mb-4">
      <div
        className="w-12 h-12 rounded-md flex items-center justify-center text-white font-medium text-lg"
        style={{ backgroundColor: project.color || "#64748b" }}
      >
        {project.key.substring(0, 2)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <div className="bg-muted text-muted-foreground text-xs font-medium rounded-full px-2 py-0.5">
            {project.key}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {project.description ||
            t("dashboard.description") ||
            "Manage and track your project tasks"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">
            {t("project.table.lead") || "Lead"}:
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-xs font-medium">
                {project.lead
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </span>
            </div>
            <span className="text-sm">{project.lead}</span>
          </div>
        </div>
        <Link
          to={`/projects/${project.id}/settings`}
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground ml-4 hover:text-[var(--primary)] transition-colors",
            `theme-${colorTheme}`
          )}
        >
          <span>{t("project.settings") || "Project settings"}</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
