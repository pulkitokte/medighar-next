import { cn } from "@/shared/lib/cn.js";
import { useUserPreferences } from "@/hooks/useUserPreferences.js";

const READING_WIDTH_CLASSES = {
  comfortable: "max-w-[1280px]",
  wide: "max-w-[1440px]",
};

function Container({ children, className }) {
  const { preferences } = useUserPreferences();
  const widthClass =
    READING_WIDTH_CLASSES[preferences.readingWidth] ??
    READING_WIDTH_CLASSES.comfortable;

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widthClass,
        preferences.compactMode && "px-3 sm:px-4 lg:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
