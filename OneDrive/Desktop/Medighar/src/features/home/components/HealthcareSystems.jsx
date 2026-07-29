import Section from '@/shared/components/ui/Section.jsx'
import Container from '@/shared/components/ui/Container.jsx'
import PageHeading from '@/shared/components/ui/PageHeading.jsx'
import { cn } from '@/shared/lib/cn.js'
import { HEALTHCARE_SYSTEMS } from '@/data/home/healthcareSystems.js'

/**
 * Premium pastel tone tokens per healthcare system, matching the approved
 * Medighhar module colour language. Keyed by system name so the existing
 * data file (HEALTHCARE_SYSTEMS) never needs to change — only how it's
 * presented does.
 */
const SYSTEM_TONES = {
  Allopathy: {
    surface: 'bg-sky-50/60',
    border: 'hover:border-sky-200',
    iconBg: 'bg-sky-100',
    iconText: 'text-sky-600',
    tagBg: 'bg-sky-100/70',
    tagText: 'text-sky-700',
    link: 'text-sky-700 hover:text-sky-800',
  },
  Ayurveda: {
    surface: 'bg-lime-50/60',
    border: 'hover:border-lime-200',
    iconBg: 'bg-lime-100',
    iconText: 'text-lime-700',
    tagBg: 'bg-lime-100/70',
    tagText: 'text-lime-700',
    link: 'text-lime-700 hover:text-lime-800',
  },
  Homeopathy: {
    surface: 'bg-violet-50/60',
    border: 'hover:border-violet-200',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    tagBg: 'bg-violet-100/70',
    tagText: 'text-violet-700',
    link: 'text-violet-700 hover:text-violet-800',
  },
  Naturopathy: {
    surface: 'bg-amber-50/60',
    border: 'hover:border-amber-200',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    tagBg: 'bg-amber-100/70',
    tagText: 'text-amber-700',
    link: 'text-amber-700 hover:text-amber-800',
  },
}

function HealthcareSystemCard({ system }) {
  const Icon = system.icon
  const tone = SYSTEM_TONES[system.name] ?? SYSTEM_TONES.Allopathy

  return (
    <div
      className={cn(
        "card-surface transition-premium flex h-full flex-col gap-5 border border-slate-100 p-7",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        tone.surface,
        tone.border,
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm",
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tone.iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5", tone.iconText)} aria-hidden="true" />
        </span>
      </span>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          {system.name}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {system.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {system.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              tone.tagBg,
              tone.tagText,
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href="#"
        className={cn(
          "transition-premium inline-flex items-center gap-1 rounded text-sm font-medium",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
          tone.link,
        )}
      >
        Learn more <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}

function HealthcareSystems() {
  return (
    <Section className="bg-gradient-to-b from-white via-slate-50/60 to-white">
      <Container className="flex flex-col items-center gap-14">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="Explore Healthcare Systems"
            subtitle="Learn about different approaches to healthcare and choose the one that best fits your needs."
          />
        </div>

        <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HEALTHCARE_SYSTEMS.map((system) => (
            <HealthcareSystemCard key={system.name} system={system} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default HealthcareSystems