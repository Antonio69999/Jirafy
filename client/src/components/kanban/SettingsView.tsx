import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsView() {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4 max-w-md">
      <h2 className="text-lg font-semibold">
        {t("dashboard.settings.title") || "Project Settings"}
      </h2>

      <div>
        <label className="text-sm font-medium block mb-1">
          {t("dashboard.settings.name") || "Project Name"}
        </label>
        <Input defaultValue="Mon Projet" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          {t("dashboard.settings.color") || "Project Color"}
        </label>
        <Input type="color" defaultValue="#3b82f6" />
      </div>

      <Button className="mt-3">{t("common.save") || "Save"}</Button>
    </div>
  );
}
