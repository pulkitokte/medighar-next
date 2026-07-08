import { Search } from "lucide-react";

function DoctorSearchBar({
  value,
  onChange,
  placeholder = "Search doctors by name or specialty...",
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition-shadow focus-within:border-blue-400 focus-within:shadow-md">
      <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search doctors"
        placeholder={placeholder}
        className="h-10 w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
      />
    </div>
  );
}

export default DoctorSearchBar;
