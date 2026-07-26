function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="card-surface card-surface-hover transition-premium flex items-center gap-3 border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="truncate text-sm font-medium text-slate-900">
          {value}
        </span>
      </div>
    </div>
  );
}

export default InfoCard;
