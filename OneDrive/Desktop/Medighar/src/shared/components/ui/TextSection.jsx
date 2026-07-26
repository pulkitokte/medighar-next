function TextSection({ title, content, icon: Icon, className }) {
  return (
    <div
      className={`card-surface flex flex-col gap-3 border border-slate-200 bg-white p-6${className ? ` ${className}` : ""}`}
    >
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      )}
      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
        {content}
      </p>
    </div>
  );
}

export default TextSection;
