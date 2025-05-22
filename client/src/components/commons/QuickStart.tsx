import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";

import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickStart() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  return (
    <Sheet>
      <div
        className={cn(
          "flex items-center rounded-full shadow-sm",
          "bg-[var(--primary)]",
          `theme-${colorTheme}`
        )}
      >
        <SheetTrigger
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-l-full",
            "hover:opacity-90 transition-colors",
            "text-md font-medium",
            "text-primary-foreground",
            "flex-grow"
          )}
        >
          <Lightbulb className="h-5 w-5" />
          <span>{t("app.quickStart.openTrigger") || "Quick Start"}</span>
        </SheetTrigger>

        <Button
          className={cn(
            "flex items-center justify-center rounded-full mx-1",
            "text-primary-foreground border-primary-foreground/30 border",
            "hover:opacity-80 transition-colors",
            "border-none"
          )}
          variant="outline"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <SheetContent className="p-0 flex flex-col h-full">
        <div
          className={cn(
            "w-full h-[16.6%] min-h-[100px] flex items-center justify-center",
            "bg-[var(--primary)]",
            `theme-${colorTheme}`
          )}
        >
          <h2 className="text-xl font-semibold text-primary-foreground">
            {t("app.quickStart.title") || "Quick Start Guide"}
          </h2>
        </div>

        <div className="flex-1 p-6">
          <div className="w-full flex justify-center mb-4">
            <div className="h-1 w-16 bg-muted rounded-full"></div>
          </div>
          <p className="text-center text-muted-foreground mb-6">
            {t("app.quickStart.description")}
          </p>

          {/* Reste du contenu ici */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
