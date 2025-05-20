import { PaletteIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useColorThemeStore } from "@/store/colorThemeStore";

const colors = [
  { name: "Blue", value: "blue" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Red", value: "red" },
  { name: "Pink", value: "pink" },
  { name: "Orange", value: "orange" },
  { name: "Green", value: "green" },
] as const;

export function ColorThemeToggle() {
  const { colorTheme, setColorTheme } = useColorThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <PaletteIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => setColorTheme(color.value)}
            className="flex items-center gap-2"
          >
            <div
              className={`w-4 h-4 rounded-full theme-${color.value} bg-primary`}
              aria-hidden="true"
            />
            {color.name}
            {colorTheme === color.value && (
              <span className="ml-auto font-semibold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
