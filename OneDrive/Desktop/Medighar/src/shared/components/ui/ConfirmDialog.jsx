import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

/**
 * Reusable confirmation dialog for destructive actions (cancel, delete).
 * Shared by every page that needs a confirm step before an irreversible
 * change, rather than each page implementing its own modal.
 * @param {{
 *   open: boolean,
 *   title: string,
 *   message: string,
 *   warning?: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   destructive?: boolean,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 * }} props
 */
function ConfirmDialog({
  open,
  title,
  message,
  warning,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    dialogRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="card-surface w-full max-w-sm border border-slate-200 bg-white p-6 outline-none"
      >
        <div className="flex items-start gap-3">
          <span
            className={
              destructive
                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50"
            }
          >
            <AlertTriangle
              className={
                destructive ? "h-5 w-5 text-red-500" : "h-5 w-5 text-blue-500"
              }
              aria-hidden="true"
            />
          </span>
          <div className="flex flex-col gap-1">
            <h2
              id="confirm-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-message"
              className="text-sm leading-relaxed text-slate-600"
            >
              {message}
            </p>
            {warning && (
              <p className="mt-1 text-sm font-medium text-amber-700">
                {warning}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
