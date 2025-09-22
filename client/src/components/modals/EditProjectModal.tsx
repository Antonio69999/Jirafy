import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProjectCreationForm from "@/components/forms/ProjectCreationForm";
import type { Project } from "@/types/project";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void | void;
  onSuccess?: (project: Project) => void;
  project?: Project;
};

export default function ProjectEditModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

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
            {t("dashboard.createProject.title") || "Créer un projet"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("dashboard.createProject.description") ||
              "Renseigne les informations pour créer un nouveau projet."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            {/* Formulaire (3/5) */}
            <div className="lg:col-span-3">
              <ProjectCreationForm
                isEditing={false}
                initialData={undefined}
                onSuccess={onSuccess}
                onClose={() => onClose(false)}
              />
            </div>

            {/* Panneau latéral (2/5) : tips/procédures */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createProject.guidelines.title") ||
                    "Bonnes pratiques"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      {t("dashboard.createProject.guidelines.item1") ||
                        "Utilise une clé courte et parlante (ex: OPS, WEB, APP)."}
                    </li>
                    <li>
                      {t("dashboard.createProject.guidelines.item2") ||
                        "Donne un nom précis et utile à la recherche."}
                    </li>
                    <li>
                      {t("dashboard.createProject.guidelines.item3") ||
                        "Ajoute une description claire (contexte, objectifs)."}
                    </li>
                    <li>
                      {t("dashboard.createProject.guidelines.item4") ||
                        "Associe la team et le lead si connu pour préparer les permissions."}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createProject.templates.title") || "Infos"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {t("dashboard.createProject.templates.body") ||
                    "Tu pourras définir le workflow du projet après la création (statuts, transitions)."}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
