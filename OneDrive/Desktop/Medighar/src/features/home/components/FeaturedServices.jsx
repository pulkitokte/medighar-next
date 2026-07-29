import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { cn } from "@/shared/lib/cn.js";
import { SERVICES } from "@/data/home/featuredServices.js";

/**
 * Premium pastel tone tokens per module, matching the approved Medighhar
 * colour language (Doctors: Sky, Medicines: Pista, Diseases: Apricot,
 * Pharmacy: Lavender). Keyed by service.key so the existing SERVICES data
 * file never needs to change — only how it's presented does.
 */
const SERVICE_TONES = {
  doctors: {
    panel: "from-sky-100 via-sky-50 to-white",
    iconBg: "bg-sky-600",
    bullet: "text-sky-600",
    button: "bg-sky-600 hover:bg-sky-700",
    blobA: "bg-sky-200/50",
    blobB: "bg-sky-100/50",
  },
  medicines: {
    panel: "from-lime-100 via-lime-50 to-white",
    iconBg: "bg-lime-600",
    bullet: "text-lime-700",
    button: "bg-lime-600 hover:bg-lime-700",
    blobA: "bg-lime-200/50",
    blobB: "bg-lime-100/50",
  },
  diseases: {
    panel: "from-orange-100 via-orange-50 to-white",
    iconBg: "bg-orange-500",
    bullet: "text-orange-600",
    button: "bg-orange-500 hover:bg-orange-600",
    blobA: "bg-orange-200/50",
    blobB: "bg-orange-100/50",
  },
  pharmacy: {
    panel: "from-violet-100 via-violet-50 to-white",
    iconBg: "bg-violet-600",
    bullet: "text-violet-600",
    button: "bg-violet-600 hover:bg-violet-700",
    blobA: "bg-violet-200/50",
    blobB: "bg-violet-100/50",
  },
};

function ServiceIllustration({ service, tone }) {
  const Icon = service.icon;

  return (
    <div
      className={cn(
        "relative flex h-64 w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-8 shadow-sm sm:h-72",
        tone.panel,
      )}
    >
      <div
        className={cn(
          "absolute -left-6 -top-6 h-24 w-24 rounded-full blur-2xl",
          tone.blobA,
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-28 w-28 rounded-full blur-2xl",
          tone.blobB,
        )}
        aria-hidden="true"
      />

      <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-white shadow-lg shadow-slate-900/5">
        <span
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl text-white",
            tone.iconBg,
          )}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function ServiceContent({ service, tone }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {service.title}
      </h3>
      <p className="text-base leading-relaxed text-slate-600">
        {service.description}
      </p>

      <ul className="flex flex-col gap-3">
        {service.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-sm text-slate-700"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Check
                className={cn("h-3.5 w-3.5", tone.bullet)}
                aria-hidden="true"
              />
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div>
        <Button className={cn("rounded-full text-white", tone.button)}>
          {service.cta}
        </Button>
      </div>
    </div>
  );
}

function ServiceRow({ service, reversed }) {
  const tone = SERVICE_TONES[service.key] ?? SERVICE_TONES.doctors;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-10 rounded-[1.75rem] p-2 transition-premium hover:-translate-y-0.5 lg:grid-cols-2 lg:gap-16",
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(reversed && "lg:order-2")}
      >
        <ServiceIllustration service={service} tone={tone} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className={cn(reversed && "lg:order-1")}
      >
        <ServiceContent service={service} tone={tone} />
      </motion.div>
    </div>
  );
}

function FeaturedServices() {
  return (
    <Section paddingY="py-20 sm:py-28">
      <Container className="flex flex-col gap-20">
        {SERVICES.map((service, index) => (
          <ServiceRow
            key={service.key}
            service={service}
            reversed={index % 2 === 1}
          />
        ))}
      </Container>
    </Section>
  );
}

export default FeaturedServices;
