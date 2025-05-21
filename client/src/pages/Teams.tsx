import { SearchBar } from "@/components/layout/SearchBar";
import { PageContainer } from "@/components/pages/PageContainer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Teams() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  return (
    <PageContainer title={t("app.sidebar.teams") || "Teams"}>
      <div className="mb-4">
        {t("teams.description") || "Manage your teams"}
      </div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <SearchBar placeholder="Rechercher une équipe..." />
        </div>
        <div className="flex space-x-2">
          <Button
            className={cn(
              "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
              `theme-${colorTheme}`
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("teams.actions.addTeam") || "Créer une équipe"}
          </Button>
          <Button
            className={cn(
              "bg-[var(--accent)] text-[var(--primary-foreground)] hover:bg-[var(--accent-hover)]",
              `theme-${colorTheme}`
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("teams.actions.addMember") || "Ajouter un membre"}
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">{t("teams.title") || "Équipes"}</h2>
      </div>
    </PageContainer>
  );
}
