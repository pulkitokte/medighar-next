import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import { FEATURES } from "@/data/home/whyChoose.js";

/**
 * Six pastel tones cycled across the trust/benefit cards, drawn from the
 * approved Medighhar module colour language rather than arbitrary Tailwind
 * picks. Keyed by index so the existing FEATURES data file never changes.
 */
const FEATURE_TONES = [
  { surface: "bg-sky-50", ring: "hover:border-sky-200", iconBg: "bg-sky-100", iconText: "text-sky-600" },
  { surface: "bg-lime-50", ring: "hover:border-lime-200", iconBg: "bg-lime-100", iconText: "text-lime-700" },
  { surface: "bg-orange-50", ring: "hover:border-orange-200", iconBg: "bg-orange-100", iconText: "text-orange-600" },
  { surface: "bg-violet-50", ring: "hover:border-violet-200", iconBg: "bg-violet-100", iconText: "text-violet-600" },
  { surface: "bg-amber-50", ring: "hover:border-amber-200", iconBg: "bg-amber-100", iconText: "text-amber-700" },
  { surface: "bg-indigo-50", ring: "hover:border-indigo-200", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
];

function FeatureCard({ feature, tone }) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "card-surface transition-premium flex h-full flex-col gap-4 border border-slate-100 p-7",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        tone.surface,
        tone.ring,
      )}
    >
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", tone.iconBg)}>
        <Icon className={cn("h-6 w-6", tone.iconText)} aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
      </div>
    </div>
  );
}

function WhyChooseMedighar() {
  return (
    <Section
      paddingY="py-20 sm:py-28"
      className="bg-gradient-to-b from-slate-50/60 via-white to-white"
    >
      <Container className="flex flex-col items-center gap-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="Why Choose Medighar"
            subtitle="Everything you need to make confident, informed healthcare decisions in one place."
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              tone={FEATURE_TONES[index % FEATURE_TONES.length]}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default WhyChooseMedighar;