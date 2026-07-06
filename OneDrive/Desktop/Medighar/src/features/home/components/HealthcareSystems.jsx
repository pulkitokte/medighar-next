import Section from '@/shared/components/ui/Section.jsx'
import Container from '@/shared/components/ui/Container.jsx'
import PageHeading from '@/shared/components/ui/PageHeading.jsx'
import { cn } from '@/shared/lib/cn.js'
import { HEALTHCARE_SYSTEMS } from '@/data/home/healthcareSystems.js'

function HealthcareSystemCard({ system }) {
  const Icon = system.icon

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        system.accent.hoverBorder,
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          system.accent.iconBg,
        )}
      >
        <Icon
          className={cn("h-6 w-6", system.accent.iconText)}
          aria-hidden="true"
        />
      </span>

      <h3 className="text-lg font-semibold text-slate-900">{system.name}</h3>

      <p className="line-clamp-2 flex-1 text-sm text-slate-600">
        {system.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {system.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              system.accent.tagBg,
              system.accent.tagText,
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href="#"
        className={cn(
          "inline-flex items-center text-sm font-medium",
          system.accent.link,
        )}
      >
        Learn More <span aria-hidden="true">&nbsp;&rarr;</span>
      </a>
    </div>
  );
}

function HealthcareSystems() {
  return (
    <Section className="bg-gradient-to-b from-white to-slate-50">
      <Container className="flex flex-col items-center gap-12">
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