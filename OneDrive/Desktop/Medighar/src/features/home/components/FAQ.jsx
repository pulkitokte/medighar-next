import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import { FAQS } from "@/data/home/faqs.js";

function FAQItem({ faq, isOpen, onToggle, id }) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;

  return (
    <div
      className={cn(
        "transition-premium overflow-hidden rounded-2xl border",
        isOpen ? "border-emerald-200 bg-emerald-50/40" : "border-slate-100 bg-white",
      )}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="transition-premium flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-500"
        >
          <span className="text-base font-medium text-slate-900 sm:text-lg">
            {faq.question}
          </span>
          <span
            className={cn(
              "transition-premium flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isOpen ? "bg-emerald-100" : "bg-slate-100",
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isOpen ? "rotate-180 text-emerald-600" : "text-slate-500",
              )}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <Section paddingY="py-20 sm:py-28" className="bg-slate-50">
      <Container className="flex flex-col items-center gap-12">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="Frequently Asked Questions"
            subtitle="Answers to common questions about how Medighar works."
          />
        </div>

        <div className="flex w-full max-w-3xl flex-col gap-3">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              id={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FAQ;