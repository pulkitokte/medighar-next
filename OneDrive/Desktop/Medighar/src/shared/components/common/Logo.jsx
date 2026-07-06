import { cn } from "@/shared/lib/cn.js";
import { appName } from "@/config/branding.js";

const MARK_SIZES = {
  sm: "h-7 w-7 rounded-md text-sm",
  md: "h-10 w-10 rounded-lg text-lg",
  lg: "h-14 w-14 rounded-xl text-2xl",
};

const TEXT_SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

function Logo({ size = "md", showText = true }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={cn(
          "flex items-center justify-center bg-blue-600 font-bold leading-none text-white",
          MARK_SIZES[size],
        )}
        aria-hidden="true"
      >
        +
      </span>
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-slate-900",
            TEXT_SIZES[size],
          )}
        >
          {appName}
        </span>
      )}
    </div>
  );
}

export default Logo;
