import { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

/**
 * A component for toggling between light and dark themes.
 * 
 * This component initializes the theme based on the value stored in `localStorage`.
 * It provides a toggle switch to change between light and dark modes and updates the
 * `localStorage` and document's class accordingly.
 * 
 * @returns {JSX.Element} The rendered component with a dark mode toggle switch.
 */
export const UseTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme === "dark" : false;
    });

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
            setIsDarkMode(storedTheme === "dark");
        }
    }, []);

    const handleThemeChange = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        document.documentElement.classList.toggle("dark", !isDarkMode);
        localStorage.setItem("theme", newTheme);
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <DarkModeToggle
                onChange={handleThemeChange}
                checked={isDarkMode}
                size={70}
            />
        </div>
    );
};
