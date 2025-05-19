import { useColorThemeStore } from "@/store/colorThemeStore";

const colors = [
  "blue",
  "yellow",
  "purple",
  "red",
  "pink",
  "orange",
  "green",
] as const;

export function ColorSwitcher() {
  const { colorTheme, setColorTheme } = useColorThemeStore();

  return (
    <div className="flex items-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setColorTheme(color)}
          className={`px-3 py-1 rounded border text-sm transition ${
            colorTheme === color ? "border-primary font-bold" : "border-muted"
          }`}
        >
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </button>
      ))}
    </div>
  );
}
