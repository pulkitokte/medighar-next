import { X } from "lucide-react";
import { useFeatureDiscovery } from "@/hooks/useFeatureDiscovery.js";

/**
 * A small, dismissible, page-local hint introducing a single feature the
 * first time a user encounters it. Visually a lighter variant of
 * WelcomeCard's pattern (card-surface, dashed border, icon + text +
 * dismiss) — inline page content, never a positioned overlay, tooltip,
 * or popover, since no such primitive exists in this app and this batch
 * intentionally doesn't introduce one.
 *
 * Distinct from WelcomeCard: WelcomeCard is app-level and shown once,
 * anywhere. DiscoveryHint is per-feature — pass a unique hintKey and it
 * persists its own dismissal independently of any other hint or of the
 * welcome card.
 * @param {{
 *   hintKey: string,
 *   icon: import("react").ComponentType<{ className?: string }>,
 *   title: string,
 *   description: string,
 * }} props
 */
function DiscoveryHint({ hintKey, icon: Icon, title, description }) {
  const { isHintSeen, dismissHint } = useFeatureDiscovery();

  if (isHintSeen(hintKey)) return null;

  return (
    <div className="card-surface relative flex items-start gap-4 border border-dashed border-emerald-200 bg-emerald-50/40 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
        <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-8">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => dismissHint(hintKey)}
        aria-label="Dismiss hint"
        className="absolute right-3 top-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default DiscoveryHint;
