import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import { STEPS } from "@/data/home/howItWorks.js";

/**
 * Deliberate pastel colour progression across the four steps, drawn from
 * the approved Medighhar module colour language: Sky (discovery) → Pista
 * (evaluation) → Lavender (connection) → Mint Emerald (action/complete).
 * Keyed by step number so the existing STEPS data file never changes.
 */
const STEP_TONES = {
  1: { surface: "bg-sky-50", ring: "border-sky-200", iconBg: "bg-sky-100", iconText: "text-sky-600", numberBg: "bg-sky-600", dot: "bg-sky-400" },
  2: { surface: "bg-lime-50", ring: "border-lime-200", iconBg: "bg-lime-100", iconText: "text-lime-700", numberBg: "bg-lime-600", dot: "bg-lime-400" },
  3: { surface: "bg-violet-50", ring: "border-violet-200", iconBg: "bg-violet-100", iconText: "text-violet-600", numberBg: "bg-violet-600", dot: "bg-violet-400" },
  4: { surface: "bg-emerald-50", ring: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", numberBg: "bg-emerald-600", dot: "bg-emerald-400" },
};

function StepCard({ step, isLast }) {
  const Icon = step.icon;
  const tone = STEP_TONES[step.number] ?? STEP_TONES[1];

  return (
    <div className="relative flex flex-col items-center gap-4 lg:items-stretch">
      {/* Vertical connector for mobile/tablet stacked layout */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[4.5rem] h-[calc(100%+2rem)] w-px -translate-x-1/2 bg-gradient-to-b from-slate-200 to-transparent lg:hidden"
        />
      )}

      <div
        className={cn(
          "card-surface transition-premium relative z-10 flex h-full w-full flex-col items-center gap-4 border p-7 text-center",
          "hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
          tone.surface,
          "border-slate-100 hover:" + tone.ring,
        )}
      >
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-white shadow-sm", tone.numberBg)}>
          {step.number}
        </div>

        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone.iconBg)}>
          <Icon className={cn("h-5 w-5", tone.iconText)} aria-hidden="true" />
        </span>

        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{step.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <Section paddingY="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="How Medighar Works"
            subtitle="A simple journey from searching for care to taking action, in four easy steps."
          />
        </div>

        <div className="relative w-full">
          {/* Horizontal connector track for desktop, sits behind the step numbers */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-[3.75rem] hidden h-px bg-gradient-to-r from-sky-200 via-violet-200 to-emerald-200 lg:block"
          />

          <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                isLast={index === STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default HowItWorks;