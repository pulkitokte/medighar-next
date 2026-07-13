import { useNavigate } from "react-router-dom";
import { StoreIcon } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

function PharmacyNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-md">
          <StoreIcon className="h-9 w-9 text-blue-500" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Pharmacy not found
        </h1>
        <p className="max-w-md text-sm text-slate-600 sm:text-base">
          We couldn&rsquo;t find a pharmacy matching this listing. It may no
          longer be available.
        </p>
      </div>

      <Button onClick={() => navigate("/pharmacy")}>Back to Pharmacies</Button>
    </div>
  );
}

export default PharmacyNotFound;
