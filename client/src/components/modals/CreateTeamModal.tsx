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

import TeamCreationForm from "@/components/forms/TeamCreationForm";
import type { Team } from "@/types/team";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSuccess?: (team: Team) => void;
};

export default function CreateTeamModal({ isOpen, onClose, onSuccess }: Props) {
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
            {t("team.create.title") || "Créer une équipe"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("team.create.description") ||
              "Renseignez les informations pour créer une nouvelle équipe."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            {/* Formulaire (3/5) */}
            <div className="lg:col-span-3">
              <TeamCreationForm
                isEditing={false}
                initialData={undefined}
                onSuccess={onSuccess}
                onClose={() => onClose(false)}
              />
            </div>

            {/* Panneau latéral (2/5) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("team.create.guidelines.title") || "Bonnes pratiques"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      {t("team.create.guidelines.item1") ||
                        "Utilisez un slug court et mémorable (ex: dev, design, ops)"}
                    </li>
                    <li>
                      {t("team.create.guidelines.item2") ||
                        "Donnez un nom clair et descriptif"}
                    </li>
                    <li>
                      {t("team.create.guidelines.item3") ||
                        "Ajoutez une description pour expliquer le rôle de l'équipe"}
                    </li>
                    <li>
                      {t("team.create.guidelines.item4") ||
                        "Désignez un owner pour gérer l'équipe"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("team.create.info.title") || "À propos des équipes"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {t("team.create.info.description") ||
                    "Les équipes permettent d'organiser les projets et de gérer les permissions. Vous pourrez ajouter des membres après la création."}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
