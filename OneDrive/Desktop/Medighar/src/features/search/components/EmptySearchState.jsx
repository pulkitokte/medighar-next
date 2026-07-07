import { SearchX } from "lucide-react";
import { motion } from "framer-motion";

function EmptySearchState() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-32 w-32 items-center justify-center"
      >
        <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent blur-xl" />
        <div className="absolute -left-3 top-1 h-8 w-8 rounded-full bg-blue-100 shadow-sm" />
        <div className="absolute -right-2 bottom-3 h-6 w-6 rounded-full bg-cyan-100 shadow-sm" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-md">
          <SearchX className="h-9 w-9 text-blue-500" aria-hidden="true" />
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-medium text-slate-900 sm:text-lg">
          Nothing to show yet
        </p>
        <p className="max-w-md text-sm text-slate-600 sm:text-base">
          Start searching to discover doctors, medicines, diseases and
          healthcare services.
        </p>
      </div>
    </div>
  );
}

export default EmptySearchState;
