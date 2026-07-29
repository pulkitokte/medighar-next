import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { TESTIMONIALS } from "@/data/home/testimonials.js";

function StarRating() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className="card-surface transition-premium relative flex h-full flex-col gap-5 border border-slate-100 bg-white p-7 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50" aria-hidden="true">
        <Quote className="h-4 w-4 text-emerald-500" fill="currentColor" />
      </span>

      <p className="flex-1 text-sm leading-relaxed text-slate-600">{testimonial.review}</p>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 text-sm font-semibold text-emerald-700">
            {testimonial.initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
            <p className="text-xs text-slate-500">{testimonial.city}</p>
          </div>
        </div>
        <StarRating />
      </div>
    </motion.div>
  );
}

function Testimonials() {
  return (
    <Section
      paddingY="py-20 sm:py-28"
      className="bg-gradient-to-b from-white via-slate-50/70 to-slate-50"
    >
      <Container className="flex flex-col items-center gap-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="What People Are Saying"
            subtitle="Real experiences from people who found clarity and confidence with Medighar."
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default Testimonials;