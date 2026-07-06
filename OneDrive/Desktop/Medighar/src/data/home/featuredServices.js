import { Stethoscope, Pill, Activity, Store } from "lucide-react";

export const SERVICES = [
  {
    key: "doctors",
    title: "Doctors",
    description:
      "Connect with experienced doctors across specialties and healthcare systems.",
    bullets: [
      "Search by specialty or condition",
      "Compare qualifications and experience",
      "Choose the right healthcare approach",
    ],
    icon: Stethoscope,
    cta: "Find Doctors",
    accent: {
      from: "from-blue-100",
      to: "to-cyan-50",
      iconBg: "bg-blue-600",
      bullet: "text-blue-600",
    },
  },
  {
    key: "medicines",
    title: "Medicines",
    description:
      "Look up medicines, understand their uses, and make informed choices.",
    bullets: [
      "Detailed medicine information",
      "Understand uses and precautions",
      "Explore alternatives when available",
    ],
    icon: Pill,
    cta: "Explore Medicines",
    accent: {
      from: "from-green-100",
      to: "to-emerald-50",
      iconBg: "bg-green-600",
      bullet: "text-green-600",
    },
  },
  {
    key: "diseases",
    title: "Diseases",
    description:
      "Understand symptoms, causes and treatment options for common conditions.",
    bullets: [
      "Clear, verified explanations",
      "Understand treatment pathways",
      "Know when to seek care",
    ],
    icon: Activity,
    cta: "Explore Diseases",
    accent: {
      from: "from-purple-100",
      to: "to-fuchsia-50",
      iconBg: "bg-purple-600",
      bullet: "text-purple-600",
    },
  },
  {
    key: "pharmacy",
    title: "Pharmacy",
    description:
      "Find pharmacies near you for quick and convenient access to medicines.",
    bullets: [
      "Locate nearby pharmacies",
      "Check availability with ease",
      "Save time on every visit",
    ],
    icon: Store,
    cta: "Find Pharmacy",
    accent: {
      from: "from-amber-100",
      to: "to-orange-50",
      iconBg: "bg-amber-600",
      bullet: "text-amber-600",
    },
  },
];
