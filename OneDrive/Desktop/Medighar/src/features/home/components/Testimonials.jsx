import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    city: "Jaipur",
    initials: "AS",
    review:
      "Medighar helped me compare treatment options before choosing a doctor. It made a stressful decision feel simple.",
  },
  {
    name: "Rohan Mehta",
    city: "Pune",
    initials: "RM",
    review:
      "I found a nearby pharmacy within minutes late at night. The search is genuinely fast and accurate.",
  },
  {
    name: "Priya Nair",
    city: "Kochi",
    initials: "PN",
    review:
      "The disease information is clear and easy to understand, without feeling overwhelming or overly technical.",
  },
  {
    name: "Arjun Verma",
    city: "Lucknow",
    initials: "AV",
    review:
      "Comparing Ayurveda and Allopathy options in one place gave me confidence in the choice I made for my father.",
  },
  {
    name: "Sneha Kulkarni",
    city: "Nagpur",
    initials: "SK",
    review:
      "Booking guidance and doctor discovery felt effortless. Medighar is now my first stop for any health query.",
  },
  {
    name: "Karan Desai",
    city: "Ahmedabad",
    initials: "KD",
    review:
      "Clean design, verified information, and quick answers. Exactly what a healthcare platform should feel like.",
  },
];

function StarRating() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="h-4 w-4 fill-amber-400 text-amber-400"
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
      className="flex h-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <StarRating />

      <p className="flex-1 text-sm text-slate-600">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {testimonial.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {testimonial.name}
          </p>
          <p className="text-xs text-slate-500">{testimonial.city}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonials() {
  return (
    <Section paddingY="py-20 sm:py-28" className="bg-slate-50">
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
