"use client";

import * as React from "react";
import { Moon, Sun, Coffee } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-8 h-8" />;
    }

    return (
        <button
            onClick={() => {
                if (resolvedTheme === "light") setTheme("dark");
                else if (resolvedTheme === "dark") setTheme("cream");
                else setTheme("light");
            }}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted hover:text-foreground inline-flex items-center justify-center relative overflow-hidden"
            aria-label="Toggle theme"
        >
            <Sun className={`h-4 w-4 transition-all ${resolvedTheme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            <Moon className={`absolute h-4 w-4 transition-all ${resolvedTheme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
            <Coffee className={`absolute h-4 w-4 transition-all ${resolvedTheme === 'cream' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
        </button>
    );
}
