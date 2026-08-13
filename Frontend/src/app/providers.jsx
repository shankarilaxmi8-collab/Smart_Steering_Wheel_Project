import {
    createContext,
    useMemo,
    useState,
    useEffect,
} from "react";

import { themes } from "./theme";


export const ThemeContext = createContext();


function Providers({ children }) {

    /*
    |--------------------------------------------------------------------------
    | Load saved theme
    |--------------------------------------------------------------------------
    */

    const [themeMode, setThemeMode] = useState(() => {

        const savedTheme = localStorage.getItem("app_theme");

        return savedTheme || "dark";
    });


    /*
    |--------------------------------------------------------------------------
    | Persist theme whenever it changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        localStorage.setItem(
            "app_theme",
            themeMode
        );

    }, [themeMode]);


    /*
    |--------------------------------------------------------------------------
    | Set theme directly
    |--------------------------------------------------------------------------
    */

    const setTheme = (mode) => {

        if (mode !== "dark" && mode !== "light") {
            return;
        }

        setThemeMode(mode);
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle theme
    |--------------------------------------------------------------------------
    */

    const toggleTheme = () => {

        setThemeMode((prev) =>
            prev === "dark"
                ? "light"
                : "dark"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Context value
    |--------------------------------------------------------------------------
    */

    const value = useMemo(
        () => ({
            themeMode,
            theme: themes[themeMode],
            setTheme,
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