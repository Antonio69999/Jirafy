import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useEffect } from "react";

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
import { useTeam } from "@/hooks/useTeam";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSuccess?: (team: Team) => void;
  team: Team;
};

export default function EditTeamModal({
  isOpen,
  onClose,
  onSuccess,
  team: initialTeam,
}: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // Récupérer les données à jour de la team
  const { data: teamData, refetch: refetchTeam } = useTeam(
    isOpen ? initialTeam.id : undefined
  );

  // Utiliser les données à jour ou les données initiales
  const team = teamData || initialTeam;

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
            {t("team.edit.title") || "Modifier l'équipe"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("team.edit.description") ||
              "Modifiez les informations de l'équipe."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            <div className="lg:col-span-3">
              <TeamCreationForm
                isEditing={true}
                initialData={team}
                onSuccess={onSuccess}
                onClose={() => onClose(false)}
              />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("team.edit.info.title") || "Informations"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Membres:</strong> {team.members_count || 0}
                  </p>
                  <p>
                    <strong>Projets:</strong> {team.projects_count || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
