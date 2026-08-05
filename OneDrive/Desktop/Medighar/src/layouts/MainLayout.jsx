import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/shared/components/common/Navbar.jsx";
import CommandPalette from "@/shared/components/ui/CommandPalette.jsx";
import { useUserPreferences } from "@/hooks/useUserPreferences.js";
import { useFeatureDiscovery } from "@/hooks/useFeatureDiscovery.js";

function MainLayout() {
  const { preferences } = useUserPreferences();
  const { markVisited } = useFeatureDiscovery();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", preferences.theme);
    root.setAttribute("data-font-size", preferences.fontSize);
    root.setAttribute("data-reduced-motion", String(preferences.reducedMotion));
    root.setAttribute("data-high-contrast", String(preferences.highContrast));
    root.setAttribute("data-compact", String(preferences.compactMode));
  }, [
    preferences.theme,
    preferences.fontSize,
    preferences.reducedMotion,
    preferences.highContrast,
    preferences.compactMode,
  ]);

  useEffect(() => {
    markVisited(location.pathname);
  }, [location.pathname, markVisited]);

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar />
      <CommandPalette />
      <Outlet />
    </main>
  );
}

export default MainLayout;