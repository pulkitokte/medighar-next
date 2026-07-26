import Button from "@/shared/components/ui/Button.jsx";

function EmptyState({ title, description, icon: Icon, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      {Icon && (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent blur-2xl" />
          <div className="absolute -left-3 top-1 h-8 w-8 rounded-full bg-blue-100 shadow-sm" />
          <div className="absolute -right-2 bottom-3 h-6 w-6 rounded-full bg-cyan-100 shadow-sm" />

          <div className="card-surface relative flex h-20 w-20 items-center justify-center border border-slate-200 bg-white">
            <Icon className="h-9 w-9 text-blue-500" aria-hidden="true" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-base font-semibold text-slate-900 sm:text-lg">
          {title}
        </p>
        {description && (
          <p className="max-w-md text-sm text-slate-500 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && actionLabel && <Button onClick={action}>{actionLabel}</Button>}
    </div>
  );
}

export default EmptyState;
