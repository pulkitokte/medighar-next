import { useNavigate } from "react-router-dom";
import { UserX } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

function DoctorNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-cyan-50 to-transparent blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-md">
          <UserX className="h-9 w-9 text-blue-500" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Doctor not found
        </h1>
        <p className="max-w-md text-sm text-slate-600 sm:text-base">
          We couldn&rsquo;t find a doctor matching this profile. They may no
          longer be listed.
        </p>
      </div>

      <Button onClick={() => navigate("/doctors")}>Back to Doctors</Button>
    </div>
  );
}

export default DoctorNotFound;
