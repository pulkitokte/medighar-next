import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { cn } from "@/shared/lib/cn.js";

const QUICK_ACTIONS = ["Doctors", "Medicines", "Diseases", "Pharmacy"];

const STATS = [
  { value: "1000+", label: "Doctors" },
  { value: "500+", label: "Medicines" },
  { value: "4", label: "Healthcare Systems" },
];

function QuickActionPill({ label }) {
  return (
    <button
      type="button"
      aria-label={`Explore ${label}`}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700"
    >
      {label}
    </button>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
      <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-md items-center justify-center py-10 lg:py-0">
      {/* Soft background glow */}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/50 via-cyan-100/40 to-transparent blur-2xl" />

      {/* Floating circles */}
      <div className="absolute -left-4 top-6 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 shadow-md" />
      <div className="absolute -right-2 bottom-10 h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 shadow-md" />
      <div className="absolute right-10 top-2 h-6 w-6 rounded-full bg-blue-300/60 shadow-sm" />

      {/* Main card */}
      <div className="relative flex w-72 flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold leading-none text-white shadow-sm">
            +
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Vitals Overview
            </p>
            <p className="text-xs text-slate-500">Updated just now</p>
          </div>
        </div>

        {/* Heartbeat line */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
          <svg viewBox="0 0 200 50" className="h-12 w-full" aria-hidden="true">
            <polyline
              points="0,25 30,25 42,10 54,42 66,5 78,40 90,25 200,25"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Colored info blocks */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-lg font-semibold text-blue-700">98%</p>
            <p className="text-xs text-slate-500">Care Match</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-3">
            <p className="text-lg font-semibold text-cyan-700">24/7</p>
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
      paddingY="py-20 sm:py-28"
      className="bg-gradient-to-br from-blue-50 via-white to-cyan-50"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[55%_45%] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left"
          >
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
              Trusted Healthcare Discovery Platform
            </span>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find the right healthcare guidance, all in one place.
            </h1>

            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Explore diseases, discover treatments, find doctors and nearby
              pharmacies.
            </p>

            <div className="w-full max-w-xl">
              <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-md">
                <Search
                  className="ml-3 h-5 w-5 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  aria-label="Search doctors, diseases, medicines"
                  placeholder="Search doctors, diseases, medicines..."
                  className="h-10 w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
                />
                <Button
                  size="md"
                  className="hidden shrink-0 rounded-full sm:inline-flex"
                >
                  Search
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "flex flex-wrap items-center justify-center gap-3",
                "lg:justify-start",
              )}
            >
              {QUICK_ACTIONS.map((action) => (
                <QuickActionPill key={action} label={action} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button size="lg">Explore Healthcare</Button>
              <Button variant="outline" size="lg">
                Find Doctors
              </Button>
            </div>

            <div className="grid w-full max-w-xl grid-cols-3 gap-4">
              {STATS.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export default Hero;
