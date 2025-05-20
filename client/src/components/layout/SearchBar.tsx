import { useColorThemeStore } from "@/store/colorThemeStore";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export function SearchBar() {
  const { colorTheme } = useColorThemeStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-lg">
        <form className="relative sm:flex sm:items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-4 text-muted-foreground" />
          </div>
          <input
            id="q"
            name="q"
            className={cn(
              "inline w-full rounded-md border py-2 pl-10 pr-3 leading-5",
              "placeholder:text-muted-foreground border-input bg-background",
              "focus:outline-none focus:ring-1 sm:text-sm",
              `theme-${colorTheme}`,
              "focus:border-primary focus:ring-primary"
            )}
            placeholder={t("app.search.placeholder")}
            type="search"
            autoFocus
            value=""
          />
        </form>
      </div>
    </div>
  );
}
