import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HeartPulse, Pill, Stethoscope } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

const PORTALS = {
  doctor: {
    title: "Doctor portal",
    noun: "doctors",
    icon: Stethoscope,
  },
  pharmacy: {
    title: "Pharmacy portal",
    noun: "pharmacies",
    icon: Pill,
  },
};

/**
 * Minimal, honest placeholder for a portal that is not built yet. It has
 * no sign-in and stores nothing.
 * @param {{ role: "doctor" | "pharmacy" }} props
 */
function PortalPlaceholderPage({ role }) {
  const navigate = useNavigate();
  const portal = PORTALS[role] ?? PORTALS.doctor;
  const Icon = portal.icon;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-teal-50 via-white to-sky-50">
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Medighar
          </span>
        </div>

        <Link
          to="/roles"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </header>

      <section className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 shadow-sm">
          <Icon className="h-10 w-10 text-teal-700" aria-hidden="true" />
        </span>

        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Coming soon
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {portal.title} is being prepared
        </h1>

        <p className="text-base leading-relaxed text-slate-600">
          This portal is not available yet, and there is nothing to sign in to
          right now. Tools for {portal.noun} will arrive in a later update.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => navigate("/roles")}
            className="rounded-full bg-teal-700 hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Back to role selection
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Explore Medighar as a patient
          </Button>
        </div>
      </section>
    </main>
  );
}

export default PortalPlaceholderPage;
