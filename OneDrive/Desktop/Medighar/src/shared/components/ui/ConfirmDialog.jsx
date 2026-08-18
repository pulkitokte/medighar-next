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

  // The element that had focus immediately before the dialog opened —
  // normally the button that triggered it. Captured before focus moves
  // into the dialog, so it can later be restored on close. Cleared after
  // each close so a stale reference is never reused across unrelated
  // openings.
  const previousFocusRef = useRef(null);

  // Kept current via its own effect (rather than as a dependency of the
  // main open/close effect below) so that a new inline onCancel identity
  // on every parent re-render — which all current consumers pass — never
  // causes the main effect to tear down and re-run while the dialog is
  // still open. That would otherwise trigger spurious focus
  // capture/restore cycles.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;

    // Capture BEFORE moving focus into the dialog, per the required order.
    previousFocusRef.current = document.activeElement;

    dialogRef.current?.focus();

    /**
     * Returns the dialog's focusable buttons (Cancel, then Confirm) in
     * DOM order. Queried live from the actual rendered elements rather
     * than held via refs, since the shared Button component isn't
     * wrapped in forwardRef and can't accept one without modifying it —
     * which is out of scope for this fix.
     * @returns {HTMLButtonElement[]}
     */
    function getFocusableElements() {
      if (!dialogRef.current) return [];
      return Array.from(dialogRef.current.querySelectorAll("button"));
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCancelRef.current?.();
        return;
      }

      if (event.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const currentIndex = focusable.indexOf(document.activeElement);

        event.preventDefault();

        if (event.shiftKey) {
          // Shift+Tab: move backward, wrapping from the first control
          // (or the container itself) to the last.
          if (currentIndex <= 0) {
            focusable[focusable.length - 1].focus();
          } else {
            focusable[currentIndex - 1].focus();
          }
        } else {
          // Tab: move forward, wrapping from the last control (or the
          // container itself) to the first.
          if (currentIndex === -1 || currentIndex === focusable.length - 1) {
            focusable[0].focus();
          } else {
            focusable[currentIndex + 1].focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";

      // Restore focus to whatever was focused before the dialog opened.
      // This cleanup runs exactly once per actual close (the effect's
      // only dependency is `open`), so it covers Cancel, Escape, and
      // Confirm uniformly without needing to know which one fired.
      //
      // Never focus a detached element: some consumers (Family Profiles,
      // Medical Records, Reminders) delete the item that owned the
      // triggering button as part of confirming, so the original element
      // may no longer be in the document. In that case, do nothing
      // further rather than guessing at a replacement target.
      const target = previousFocusRef.current;
      if (
        target instanceof HTMLElement &&
        target !== dialogRef.current &&
        document.contains(target)
      ) {
        target.focus();
      }
      previousFocusRef.current = null;
    };
  }, [open]);

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