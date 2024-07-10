import React, { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

export const ThemeProvider = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
            setIsDarkMode(storedTheme === "dark");
        }
    });

    const handleThemeChange = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("theme", newTheme);
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={isDarkMode ? "dark" : ""}>
        <DarkModeToggle
            onChange={handleThemeChange}
            checked={isDarkMode}
            size={70}
        />
        </div>
    );
}
