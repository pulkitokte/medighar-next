import { Loader2 } from "lucide-react";

function LoadingState({ label = "Loading..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 py-16 text-center"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-blue-600"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-600 sm:text-base">{label}</p>
    </div>
  );
}

export default LoadingState;
