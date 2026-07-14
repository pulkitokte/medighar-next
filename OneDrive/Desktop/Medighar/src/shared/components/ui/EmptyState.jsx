import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

/**
 * Reusable error state. Reuses the shared Button for the retry action.
 * @param {{
 *   title?: string,
 *   message?: string,
 *   onRetry?: () => void,
 *   retryLabel?: string,
 * }} props
 */
function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      </span>

      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-medium text-slate-900 sm:text-lg">
          {title}
        </p>
        {message && (
          <p className="max-w-md text-sm text-slate-600 sm:text-base">
            {message}
          </p>
        )}
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
