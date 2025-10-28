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
  onClose: (open: boolean) => void;
  onSuccess?: (project: Project) => void;
  project: Project; // Rendre project obligatoire
};

export default function ProjectEditModal({
  isOpen,
  onClose,
  onSuccess,
  project, 
}: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[1300px] w-[90vw] max-h-[90vh] overflow-hidden border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {t("project.edit.title") || "Modifier le projet"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("project.edit.description") ||
              "Modifiez les informations du projet."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            {/* Formulaire (3/5) */}
            <div className="lg:col-span-3">
              <ProjectCreationForm
                isEditing={true} // Mode édition
                initialData={project} // Passer les données du projet
                onSuccess={onSuccess}
                onClose={() => onClose(false)}
              />
            </div>

            {/* Panneau latéral (2/5) : tips/procédures */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("project.edit.info.title") || "Informations"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      {t("project.edit.info.item1") ||
                        "La clé du projet ne peut pas être modifiée."}
                    </li>
                    <li>
                      {t("project.edit.info.item2") ||
                        "Le changement de team peut affecter les permissions."}
                    </li>
                    <li>
                      {t("project.edit.info.item3") ||
                        "Le lead peut être modifié à tout moment."}
                    </li>
                    <li>
                      {t("project.edit.info.item4") ||
                        "Les modifications sont appliquées immédiatement."}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("project.edit.members.title") || "Membres"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {t("project.edit.members.body") ||
                    "Pour gérer les membres du projet, utilisez le bouton 'Membres' dans la liste des projets."}
                </div>
              </div>

              {/* Info sur le projet actuel */}
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-accent/20">
                <h3 className="text-base font-medium mb-2">
                  {t("project.edit.current.title") || "Projet actuel"}
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clé :</span>
                    <span className="font-mono font-medium">{project.key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le :</span>
                    <span>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {project.issues_count !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issues :</span>
                      <span>{project.issues_count}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
