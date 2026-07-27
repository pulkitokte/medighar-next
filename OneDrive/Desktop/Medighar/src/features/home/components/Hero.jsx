import {
  Search,
  Leaf,
  HeartPulse,
  ShieldCheck,
  Pill,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { cn } from "@/shared/lib/cn.js";
import { useMedicalProfile } from "@/hooks/useMedicalProfile.js";
import { QUICK_ACTIONS, STATS } from "@/data/home/hero.js";

const STAT_ACCENTS = [
  { bg: "bg-sky-50", text: "text-sky-700" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-violet-50", text: "text-violet-700" },
];

function getGreeting(hour) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function GreetingBadge() {
  const { profile } = useMedicalProfile();
  const firstName = profile?.fullName?.trim().split(" ")[0];
  const greeting = getGreeting(new Date().getHours());

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm">
      {greeting}
      {firstName ? `, ${firstName}` : ""}
      <span aria-hidden="true">👋</span>
    </span>
  );
}

function QuickActionPill({ label }) {
  return (
    <button
      type="button"
      aria-label={`Explore ${label}`}
      className="transition-premium rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      {label}
    </button>
  );
}

function StatCard({ value, label, accent }) {
  return (
    <div
      className={cn(
        "card-surface flex flex-col items-center gap-1 border border-slate-100 px-4 py-4 text-center sm:px-5",
        accent.bg,
      )}
    >
      <p
        className={cn(
          "text-2xl font-semibold tracking-tight sm:text-3xl",
          accent.text,
        )}
      >
        {value}
      </p>
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
    </div>
  );
}

function DecorativeIcon({ Icon, className, iconClassName }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute flex items-center justify-center rounded-2xl bg-white/90 shadow-md shadow-slate-200/60",
        className,
      )}
    >
      <Icon className={iconClassName} />
    </span>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-md items-center justify-center py-10 lg:py-0">
      <div
        className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-emerald-100/60 via-sky-100/40 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* Subtle decorative healthcare graphics — CSS-animated, reduced-motion safe */}
      <DecorativeIcon
        Icon={Leaf}
        className="animate-float-slow -left-6 top-4 h-11 w-11 text-emerald-500"
        iconClassName="h-5 w-5"
      />
      <DecorativeIcon
        Icon={Plus}
        className="animate-float-medium -right-2 top-16 h-9 w-9 text-sky-500"
        iconClassName="h-4 w-4"
      />
      <DecorativeIcon
        Icon={ShieldCheck}
        className="animate-float-fast bottom-8 -left-4 h-11 w-11 text-violet-500"
        iconClassName="h-5 w-5"
      />
      <DecorativeIcon
        Icon={Pill}
        className="animate-float-slow bottom-0 right-0 h-9 w-9 text-amber-500"
        iconClassName="h-4 w-4"
      />
      <span
        aria-hidden="true"
        className="animate-float-medium absolute right-10 top-0 h-3 w-3 rounded-full bg-emerald-300/70"
      />
      <span
        aria-hidden="true"
        className="animate-float-fast absolute left-10 bottom-16 h-2.5 w-2.5 rounded-full bg-sky-300/70"
      />
      <span
        aria-hidden="true"
        className="animate-float-slow absolute left-0 top-1/2 h-2 w-2 rounded-full bg-amber-300/70"
      />

      {/* Main card */}
      <div className="card-surface relative flex w-72 flex-col gap-5 border border-slate-100 bg-white/95 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Vitals Overview
            </p>
            <p className="text-xs text-slate-500">Updated just now</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 p-4">
          <svg viewBox="0 0 200 50" className="h-12 w-full" aria-hidden="true">
            <polyline
              points="0,25 30,25 42,10 54,42 66,5 78,40 90,25 200,25"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-lg font-semibold text-emerald-700">98%</p>
            <p className="text-xs text-slate-500">Care Match</p>
          </div>
          <div className="rounded-xl bg-sky-50 p-3">
            <p className="text-lg font-semibold text-sky-700">24/7</p>
            <p className="text-xs text-slate-500">Availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <Section
      paddingY="pt-10 pb-16 sm:pt-14 sm:pb-24"
      className="relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50/60 to-amber-50" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white/70 p-6 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.18),0_16px_32px_-16px_rgba(15,23,42,0.08)] sm:rounded-[2.5rem] sm:p-10 lg:p-14"
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[55%_45%] lg:gap-10">
            <div className="flex flex-col items-center gap-6 text-center sm:gap-7 lg:items-start lg:text-left">
              <GreetingBadge />

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
                <span className="block">Your Health,</span>
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                Explore diseases, discover treatments, and connect with trusted
                doctors and nearby pharmacies — all in one calm, unified space.
              </p>

              <div className="w-full max-w-xl">
                <div className="transition-premium flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-sm hover:shadow-md focus-within:border-emerald-300 focus-within:shadow-md">
                  <Search
                    className="ml-3 h-5 w-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    aria-label="Search doctors, diseases, medicines"
                    placeholder="Search doctors, diseases, medicines..."
                    className="h-11 w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
                  />
                  <Button
                    size="md"
                    className="hidden shrink-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 sm:inline-flex"
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionPill key={action} label={action} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/10 hover:from-emerald-700 hover:to-teal-700"
                >
                  Explore Healthcare
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-slate-300"
                >
                  Find Doctors
                </Button>
              </div>

              <div className="grid w-full max-w-xl grid-cols-3 gap-3 sm:gap-4">
                {STATS.map((stat, index) => (
                  <StatCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    accent={STAT_ACCENTS[index % STAT_ACCENTS.length]}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default Hero;
