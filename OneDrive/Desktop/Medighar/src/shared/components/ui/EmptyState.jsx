function EmptyState({ icon: Icon, title, description, action, children }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      {Icon && (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-md">
            <Icon className="h-9 w-9 text-blue-500" aria-hidden="true" />
          </div>
        </div>
      )}

      {(title || description) && (
        <div className="flex flex-col items-center gap-1">
          {title && (
            <p className="text-base font-medium text-slate-900 sm:text-lg">
              {title}
            </p>
          )}
          {description && (
            <p className="max-w-md text-sm text-slate-600 sm:text-base">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
      {action}
    </div>
  );
}

export default EmptyState;
