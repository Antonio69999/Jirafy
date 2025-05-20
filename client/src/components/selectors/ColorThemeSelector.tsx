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
import { useColorThemeStore, type ColorTheme } from "@/store/colorThemeStore";

export function ColorThemeSelector() {
  const { t } = useTranslation();
  const { colorTheme, setColorTheme } = useColorThemeStore();

  const colors: { name: string; value: ColorTheme }[] = [
    { name: t("settings.colorTheme.blue"), value: "blue" },
    { name: t("settings.colorTheme.yellow"), value: "yellow" },
    { name: t("settings.colorTheme.purple"), value: "purple" },
    { name: t("settings.colorTheme.red"), value: "red" },
    { name: t("settings.colorTheme.pink"), value: "pink" },
    { name: t("settings.colorTheme.orange"), value: "orange" },
    { name: t("settings.colorTheme.green"), value: "green" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("settings.colorTheme.title") || "Accent Color"}
        </CardTitle>
        <CardDescription>
          {t("settings.colorTheme.description") ||
            "Choose your preferred accent color for the interface."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {colors.map((color) => (
                      <button
              key={color.value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md transition-colors",
                `theme-${colorTheme}`,
                "hover:bg-[var(--hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none",
                colorTheme === color.value ? "bg-[var(--active-bg)]" : ""
              )}
              onClick={() => setColorTheme(color.value)}
            >
              <div
                className={`w-5 h-5 rounded-full theme-${color.value} bg-primary`}
                aria-hidden="true"
              />
              <span className="font-medium">{color.name}</span>
              {colorTheme === color.value && (
                <CheckIcon className="h-4 w-4 ml-auto text-foreground" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
