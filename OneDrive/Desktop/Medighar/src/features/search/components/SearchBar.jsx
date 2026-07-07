import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/shared/lib/cn.js";

function SearchBar({
  value,
  onChange,
  placeholder = "Search doctors, medicines, diseases...",
  className,
}) {
  const handleClear = () => onChange("");

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-md transition-shadow focus-within:border-blue-400 focus-within:shadow-lg",
        className,
      )}
    >
      <Search
        className="ml-2 h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-600"
        aria-hidden="true"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search Medighar"
        placeholder={placeholder}
        className="h-12 w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
      />

      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
