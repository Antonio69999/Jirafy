import { create } from "zustand";

type ColorTheme =
  | "blue"
  | "yellow"
  | "purple"
  | "red"
  | "pink"
  | "orange"
  | "green";

interface ColorThemeStore {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export const useColorThemeStore = create<ColorThemeStore>((set) => ({
  colorTheme: "blue", // valeur par défaut

  setColorTheme: (theme) => {
    const root = document.documentElement;
    root.classList.remove(
      "theme-blue",
      "theme-yellow",
      "theme-purple",
      "theme-red",
      "theme-pink",
      "theme-orange",
      "theme-green"
    );
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("color-theme", theme); // persistance
    set({ colorTheme: theme });
  },
}));
