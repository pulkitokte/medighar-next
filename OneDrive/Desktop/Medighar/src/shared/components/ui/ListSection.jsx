function ListSection({ icon: Icon, title, items }) {
  return (
    <div className="card-surface flex flex-col gap-3 border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListSection;