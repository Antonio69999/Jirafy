import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/pages/PageContainer";
import { LanguageSelector } from "@/components/selectors/LanguageSelector";
import { ColorThemeSelector } from "@/components/selectors/ColorThemeSelector";
import { ThemeModeSelector } from "@/components/selectors/ThemeModeSelector";

function Settings() {
  const { t } = useTranslation();

  return (
    <PageContainer title={t("settings.title") || "Settings"}>
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <p className="text-muted-foreground mb-6">
          {t("settings.description") ||
            "Manage your application settings here."}
        </p>

        <div className="space-y-8">
          {/* Appearance section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {t("settings.appearance.title") || "Appearance"}
            </h2>

            <div className="space-y-4">
              <ThemeModeSelector />
              <ColorThemeSelector />
            </div>
          </div>

          {/* Localization section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {t("settings.localization.title") || "Localization"}
            </h2>

            <LanguageSelector />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Settings;
