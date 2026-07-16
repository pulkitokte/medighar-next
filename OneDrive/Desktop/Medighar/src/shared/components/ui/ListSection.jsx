/**
 * Reusable icon + heading + bullet list card shared by every Details page
 * (e.g. Doctor availability, Medicine uses/side effects, Disease symptoms,
 * Pharmacy services).
 * @param {{ icon: React.ComponentType, title: string, items: Array<string> }} props
 */
function ListSection({ icon: Icon, title, items }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-600 sm:text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListSection;
