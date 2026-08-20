import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn.js";

const VARIANT_CLASSES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-100",
  ghost: "text-slate-900 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZE_CLASSES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

/**
 * Wrapped in forwardRef so consumers (e.g. ConfirmDialog) can obtain a
 * real ref to the underlying DOM <button> element — for example, to
 * programmatically focus it. Button always renders a single <button>
 * element (no polymorphic "as"/link rendering exists in the current
 * implementation), so the ref is forwarded directly with no branching.
 * Every existing prop, variant, size, and behavior is unchanged; this is
 * purely additive.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    className,
    type = "button",
    onClick,
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
