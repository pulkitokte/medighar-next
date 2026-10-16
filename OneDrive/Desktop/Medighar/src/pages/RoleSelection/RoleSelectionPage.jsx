import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

const ROLES = [
  {
    key: "patient",
    title: "Patient",
    description:
      "Find medicines, diseases, doctors and pharmacies, and keep your health records, appointments and reminders organized.",
    icon: UserRound,
    to: "/home",
    status: "Available now",
    actionLabel: "Continue as Patient",
    available: true,
  },
  {
    key: "doctor",
    title: "Doctor",
    description:
      "An entry point for doctors. The doctor portal is being prepared.",
    icon: Stethoscope,
    to: "/doctor-portal",
    status: "Coming soon",
    actionLabel: "Learn more",
    available: false,
  },
  {
    key: "pharmacy",
    title: "Pharmacy",
    description:
      "An entry point for pharmacies. The pharmacy portal is being prepared.",
    icon: Pill,
    to: "/pharmacy-portal",
    status: "Coming soon",
    actionLabel: "Learn more",
    available: false,
  },
];

function RoleCard({ role }) {
  const navigate = useNavigate();
  const Icon = role.icon;

  return (
    <article className="flex h-full flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm motion-safe:transition-all motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-reduce:transform-none">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
          <Icon className="h-7 w-7 text-teal-700" aria-hidden="true" />
        </span>
        <span
          className={
            role.available
              ? "inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
              : "inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          }
        >
          {role.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-900">{role.title}</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {role.description}
        </p>
      </div>

      <Button
        variant={role.available ? "primary" : "outline"}
        fullWidth
        onClick={() => navigate(role.to)}
        rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        className={
          role.available
            ? "rounded-full bg-teal-700 hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            : "rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        }
      >
        {role.actionLabel}
      </Button>
    </article>
  );
}

function RoleSelectionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-teal-50 via-white to-sky-50">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden="true"
      />

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
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </header>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How would you like to continue?
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Choose the role that fits you. Each role leads to its own entry
            point.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <RoleCard key={role.key} role={role} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default RoleSelectionPage;
