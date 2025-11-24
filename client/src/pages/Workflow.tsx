import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { PageContainer } from "@/components/pages/PageContainer";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WorkflowDiagram from "@/components/workflow/WorkflowDiagram";
import WorkflowEditor from "@/components/workflow/WorkflowEditor";
import { useProjects } from "@/hooks/useProject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Workflow() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);

  // Récupérer le projet sélectionné depuis l'URL
  const selectedProjectId = searchParams.get("project");

  // Récupérer la liste des projets
  const { data: projectsData, loading: projectsLoading } = useProjects({
    per_page: 100,
  });

  // Synchroniser le projet sélectionné avec l'URL
  const handleProjectChange = (projectId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("project", projectId);
    setSearchParams(newSearchParams);
  };

  // Sélectionner automatiquement le premier projet si aucun n'est sélectionné
  useEffect(() => {
    if (
      !selectedProjectId &&
      projectsData?.data &&
      projectsData.data.length > 0
    ) {
      handleProjectChange(String(projectsData.data[0].id));
    }
  }, [projectsData, selectedProjectId]);

  return (
    <PageContainer title={t("app.sidebar.workflows") || "Workflows"}>
      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="flex-1 max-w-xs">
          <Select
            value={selectedProjectId || undefined}
            onValueChange={handleProjectChange}
            disabled={projectsLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  projectsLoading ? "Chargement..." : "Sélectionner un projet"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {projectsData?.data?.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.key} - {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground flex-1">
          {t("workflow.description") ||
            "Gérez les transitions de statut de vos projets"}
        </p>

        {selectedProjectId && (
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Plus className="mr-2 h-4 w-4" />
            {isEditing ? "Voir le diagramme" : "Modifier"}
          </Button>
        )}
      </div>

      {selectedProjectId ? (
        isEditing ? (
          <WorkflowEditor />
        ) : (
          <WorkflowDiagram />
        )
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <p className="text-muted-foreground">
            Sélectionnez un projet pour afficher son workflow
          </p>
        </div>
      )}
    </PageContainer>
  );
}
