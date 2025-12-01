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
import { ReactFlowProvider } from "@xyflow/react";

export default function Workflow() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);

  const selectedProjectId = searchParams.get("project");

  const { data: projectsData, loading: projectsLoading } = useProjects({
    per_page: 100,
  });

  const handleProjectChange = (projectId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("project", projectId);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (
      !selectedProjectId &&
      projectsData?.data &&
      projectsData.data.length > 0
    ) {
      handleProjectChange(String(projectsData.data[0].id));
    }
  }, [projectsData, selectedProjectId]);

  // Empêche le scroll sur la page
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <PageContainer
      title={t("app.sidebar.workflows") || "Workflows"}
      className="h-screen flex flex-col overflow-hidden p-0"
      compact
    >
      <div className="mb-4 flex justify-between items-center gap-4 shrink-0">
        <div className="flex-1 max-w-xs">
          <p className="text-sm text-muted-foreground flex-1 mb-2">
            {t("workflow.description") ||
              "Gérez les transitions de statut de vos projets"}
          </p>
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

        {selectedProjectId && (
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Plus className="mr-2 h-4 w-4" />
            {isEditing ? "Voir le diagramme" : "Modifier"}
          </Button>
        )}
      </div>

      <ReactFlowProvider>
        {" "}
        {/* Envelopper ici */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedProjectId ? (
            isEditing ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <WorkflowEditor />
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <WorkflowDiagram />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center flex-1 h-full">
              <p className="text-muted-foreground">
                Sélectionnez un projet pour afficher son workflow
              </p>
            </div>
          )}
        </div>
      </ReactFlowProvider>
    </PageContainer>
  );
}
