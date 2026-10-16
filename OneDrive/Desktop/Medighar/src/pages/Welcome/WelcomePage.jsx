import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";

const ROLE_HIGHLIGHTS = [
  { key: "patient", label: "Patients", icon: UserRound },
  { key: "doctor", label: "Doctors", icon: Stethoscope },
  { key: "pharmacy", label: "Pharmacies", icon: Pill },
];

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-teal-50 via-white to-sky-50">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center gap-2 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
          <HeartPulse className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Medighar
        </span>
      </header>

      <section className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 px-6 pb-16 text-center">
        <span className="inline-flex items-center rounded-full border border-teal-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-teal-800 shadow-sm">
          A healthcare platform
        </span>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Healthcare, brought together in one place
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Medighar is built for patients, doctors and pharmacies. Discover
          health information and manage your care today, with more roles being
          prepared.
        </p>

        <ul
          className="flex flex-wrap items-center justify-center gap-3"
          aria-label="Who Medighar is for"
        >
          {ROLE_HIGHLIGHTS.map(({ key, label, icon: Icon }) => (
            <li
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              <Icon className="h-4 w-4 text-teal-700" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <Button
          size="lg"
          onClick={() => navigate("/roles")}
          rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
          className="rounded-full bg-teal-700 shadow-lg shadow-teal-900/10 hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-reduce:transform-none"
        >
          Get Started
        </Button>
      </section>
    </main>
  );
}

export default WelcomePage;
