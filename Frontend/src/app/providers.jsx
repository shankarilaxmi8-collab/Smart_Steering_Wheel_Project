import { createContext, useMemo, useState } from "react";
import { themes } from "./theme";

export const ThemeContext = createContext();

function Providers({ children }) {
  const [themeMode, setThemeMode] = useState("dark");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      themeMode,
      theme: themes[themeMode],
      toggleTheme,
    }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default Providers;