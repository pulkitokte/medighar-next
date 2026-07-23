import { cn } from "@/shared/lib/cn.js";
import { useUserPreferences } from "@/hooks/useUserPreferences.js";

function Section({ children, className, paddingY = "py-16" }) {
  const { preferences } = useUserPreferences();

  return (
    <section
      className={cn(paddingY, preferences.compactMode && "py-10", className)}
    >
      {children}
    </section>
  );
}

export default Section;
