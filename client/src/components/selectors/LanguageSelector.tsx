import { useTranslation } from "react-i18next";
import { CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.language.title") || "Language"}</CardTitle>
        <CardDescription>
          {t("settings.language.description") ||
            "Select your preferred language for the interface."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                "flex items-center justify-between w-full p-3 rounded-md text-start transition-colors",
                `theme-${colorTheme}`,
                "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                i18n.language === language.code ? "bg-[var(--active-bg)]" : ""
              )}
              onClick={() => i18n.changeLanguage(language.code)}
            >
              <span className="font-medium">{language.name}</span>
              {i18n.language === language.code && (
                <CheckIcon className="h-4 w-4 text-foreground" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
