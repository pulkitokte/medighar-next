import { Search, Scale, Users, CheckCircle2 } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";

const STEPS = [
  {
    number: 1,
    title: "Search",
    description: "Search doctors, medicines or diseases.",
    icon: Search,
  },
  {
    number: 2,
    title: "Compare",
    description: "Compare treatment approaches and healthcare systems.",
    icon: Scale,
  },
  {
    number: 3,
    title: "Connect",
    description: "Find doctors and nearby pharmacies.",
    icon: Users,
  },
  {
    number: 4,
    title: "Take Action",
    description: "Book appointments or continue your healthcare journey.",
    icon: CheckCircle2,
  },
];

function StepCard({ step, isLast }) {
  const Icon = step.icon;

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-full flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition",
          "hover:-translate-y-1 hover:shadow-lg",
        )}
      >
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm">
          {step.number}
        </div>

        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </span>

        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
        <p className="text-sm text-slate-600">{step.description}</p>
      </div>

      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-full top-10 hidden h-0.5 w-8 -translate-y-1/2 border-t-2 border-dashed border-slate-300 lg:block"
        />
      )}
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

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default HowItWorks;
