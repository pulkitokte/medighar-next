import { Sparkles, X } from "lucide-react";

/**
 * A single, dismissible first-visit orientation card. Visually matches
 * the existing Dashboard "Suggested for You" card language (dashed
 * emerald border, card-surface, emerald accent icon) rather than
 * introducing a new visual pattern. Dismissal is permanent, mirroring
 * how every other one-time notice in this app behaves — there is no
 * snooze state.
 * @param {{ onDismiss: () => void }} props
 */
function WelcomeCard({ onDismiss }) {
  return (
    <div className="card-surface relative flex items-start gap-4 border border-dashed border-emerald-200 bg-emerald-50/40 p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
        <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-8">
        <h2 className="text-base font-semibold text-slate-900">
          Welcome to Medighar
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Everything about your health lives here — appointments, records,
          reminders, and more. Press{" "}
          <span className="font-medium text-slate-700">Ctrl/Cmd + K</span>{" "}
          anytime to search across all of it, or start with the checklist below
          to set a few things up.
        </p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss welcome message"
        className="absolute right-4 top-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default WelcomeCard;
