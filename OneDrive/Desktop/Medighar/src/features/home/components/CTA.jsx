import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";

function CTA() {
  return (
    <Section paddingY="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 px-6 py-16 text-center shadow-xl sm:px-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to take control of your healthcare?
          </h2>

          <p className="max-w-2xl text-base text-blue-50 sm:text-lg">
            Search diseases, compare treatments, discover doctors and find
            nearby pharmacies — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/60 text-white hover:bg-white/10"
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
