"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial state from html tag
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <button className="text-on-surface-variant w-10 h-10 flex items-center justify-center rounded-full">
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>dark_mode</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-on-surface-variant hover:text-primary-container transition-colors duration-300 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
