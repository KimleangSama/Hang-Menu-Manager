import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";
import { MoonStar, Sun } from "lucide-react";

export function NavTheme() {
    const [theme, setTheme] = useState(() => {
        // Get the initial theme from local storage or default to 'light'
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        // Apply the theme to the body element
        document.body.className = theme;
        // Save the theme to local storage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button
                        className="rounded-full w-8 h-8 bg-background"
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                    >
                        <Sun className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
                        <MoonStar className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
                        <span className="sr-only">Switch Theme</span>
                    </Button>
                </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    );
}