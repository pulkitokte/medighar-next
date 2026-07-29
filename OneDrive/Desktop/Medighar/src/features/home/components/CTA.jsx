import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";

function CTA() {
  return (
    <Section paddingY="py-20 sm:py-28" className="bg-slate-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-16 text-center shadow-[0_30px_60px_-30px_rgba(16,185,129,0.25)] sm:px-16"
        >
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-sky-100/50 blur-3xl"
            aria-hidden="true"
          />

          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <HeartPulse
              className="h-6 w-6 text-emerald-600"
              aria-hidden="true"
            />
          </span>

          <h2 className="relative text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Ready to take control of your healthcare?
          </h2>

          <p className="relative max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Search diseases, compare treatments, discover doctors and find
            nearby pharmacies — all in one place.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/10 hover:from-emerald-700 hover:to-teal-700"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300"
            >
              Explore Doctors
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default CTA;
