import { useTranslation } from "react-i18next";
import {
  CheckIcon,
  MoonIcon,
  SunIcon,
  MonitorIcon,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/commons/ThemeProvider";
import { useColorThemeStore } from "@/store/colorThemeStore";

export function ThemeModeSelector() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { colorTheme } = useColorThemeStore();

  const themes: { name: string; value: Theme; icon: LucideIcon }[] = [
    {
      name: t("settings.themeMode.light") || "Light",
      value: "light",
      icon: SunIcon,
    },
    {
      name: t("settings.themeMode.dark") || "Dark",
      value: "dark",
      icon: MoonIcon,
    },
    {
      name: t("settings.themeMode.system") || "System",
      value: "system",
      icon: MonitorIcon,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.themeMode.title") || "Theme Mode"}</CardTitle>
        <CardDescription>
          {t("settings.themeMode.description") ||
            "Choose between light, dark, or system theme."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {themes.map(({ name, value, icon: Icon }) => (
            <button
              key={value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md text-start transition-colors",
                `theme-${colorTheme}`,
                "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                theme === value ? "bg-[var(--active-bg)]" : ""
              )}
              onClick={() => setTheme(value)}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{name}</span>
              {theme === value && (
                <CheckIcon className="h-4 w-4 ml-auto text-foreground" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
