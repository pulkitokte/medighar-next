import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { cn } from "@/shared/lib/cn.js";
import { SERVICES } from "@/data/home/featuredServices.js";

function ServiceIllustration({ service }) {
  const Icon = service.icon;

  return (
    <div
      className={cn(
        "relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br p-8 shadow-sm sm:h-72",
        service.accent.from,
        service.accent.to,
      )}
    >
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/30 blur-xl" />

      <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg">
        <span
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl text-white",
            service.accent.iconBg,
          )}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function ServiceContent({ service }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {service.title}
      </h3>
      <p className="text-base text-slate-600">{service.description}</p>

      <ul className="flex flex-col gap-3">
        {service.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-sm text-slate-700"
          >
            <Check
              className={cn("mt-0.5 h-4 w-4 shrink-0", service.accent.bullet)}
              aria-hidden="true"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div>
        <Button>{service.cta}</Button>
      </div>
    </div>
  );
}

function ServiceRow({ service, reversed }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-10 rounded-2xl p-2 transition hover:-translate-y-1 lg:grid-cols-2 lg:gap-16",
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(reversed && "lg:order-2")}
      >
        <ServiceIllustration service={service} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className={cn(reversed && "lg:order-1")}
      >
        <ServiceContent service={service} />
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
