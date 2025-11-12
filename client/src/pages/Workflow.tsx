import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/pages/PageContainer";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WorkflowDiagram from "@/components/workflow/WorkflowDiagram";
import WorkflowEditor from "@/components/workflow/WorkflowEditor";

export default function Workflow() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageContainer title={t("app.sidebar.workflows") || "Workflows"}>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {t("workflow.description") ||
            "Gérez les transitions de statut de vos projets"}
        </p>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Plus className="mr-2 h-4 w-4" />
          {isEditing ? "Voir le diagramme" : "Modifier"}
        </Button>
      </div>

      {isEditing ? <WorkflowEditor /> : <WorkflowDiagram />}
    </PageContainer>
  );
}
