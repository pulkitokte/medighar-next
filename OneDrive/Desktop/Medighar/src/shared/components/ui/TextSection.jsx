/**
 * Reusable single-paragraph information card shared by every Details page
 * (e.g. Doctor Biography, Medicine Description, Disease Treatment Summary,
 * Pharmacy About). Entity-agnostic: accepts only display props, no business
 * logic. The icon is optional — when provided, it's rendered inline with
 * the heading; when omitted, only the heading is shown.
 * @param {{
 *   title: string,
 *   content: React.ReactNode,
 *   icon?: React.ComponentType,
 *   className?: string,
 * }} props
 */
function TextSection({ title, content, icon: Icon, className }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6${className ? ` ${className}` : ""}`}
    >
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      )}
      <p className="text-sm text-slate-600 sm:text-base">{content}</p>
    </div>
  );
}

export default TextSection;
