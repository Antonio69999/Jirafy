import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useSearchParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import CreateTaskForm from "@/components/forms/CreateTaskForm";
import type { Issue } from "@/types/issue";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSuccess?: (issue: Issue) => void;
};

export default function CreateTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [searchParams] = useSearchParams();

  // Récupérer le projet depuis l'URL si disponible
  const currentProjectId = searchParams.get("project");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[1300px] w-[90vw] max-h[90vh] overflow-hidden border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {t("dashboard.addTask.title") || "Créer une tâche"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("dashboard.addTask.description") ||
              "Créez une nouvelle tâche pour gérer votre projet."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            {/* Formulaire (3/5) */}
            <div className="lg:col-span-3">
              <CreateTaskForm
                isEditing={false}
                initialData={
                  currentProjectId ? { project: currentProjectId } : undefined
                }
                onSuccess={onSuccess}
                onClose={() => onClose(false)}
              />
            </div>

            {/* Panneau latéral (2/5) : tips/procédures */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createTask.guidelines.title") ||
                    "Bonnes pratiques"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      {t("dashboard.createTask.guidelines.item1") ||
                        "Utilisez un titre clair et orienté vers l'action"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item2") ||
                        "Incluez des détails pertinents dans la description"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item3") ||
                        "Assignez des étiquettes appropriées pour un filtrage facile"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item4") ||
                        "Fixez des dates d'échéance réalistes"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createTask.templates.title") ||
                    "Modèle de tâche"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {t("dashboard.createTask.templates.description") ||
                    "Utilisez ce modèle pour créer une nouvelle tâche structurée et cohérente."}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
