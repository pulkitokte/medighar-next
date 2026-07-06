import { Stethoscope, Leaf, Sparkles, HeartPulse } from "lucide-react";

export const HEALTHCARE_SYSTEMS = [
  {
    name: "Allopathy",
    description:
      "Modern medicine focused on diagnosing and treating disease with evidence-based therapies.",
    tags: ["Evidence Based", "Clinical Care"],
    icon: Stethoscope,
    accent: {
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      tagBg: "bg-blue-50",
      tagText: "text-blue-700",
      link: "text-blue-600 hover:text-blue-700",
      hoverBorder: "hover:border-blue-200",
    },
  },
  {
    name: "Ayurveda",
    description:
      "An ancient Indian system that balances body, mind, and spirit through natural remedies.",
    tags: ["Natural", "Lifestyle"],
    icon: Leaf,
    accent: {
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      tagBg: "bg-green-50",
      tagText: "text-green-700",
      link: "text-green-600 hover:text-green-700",
      hoverBorder: "hover:border-green-200",
    },
  },
  {
    name: "Homeopathy",
    description:
      "A holistic approach that uses highly diluted natural substances to stimulate healing.",
    tags: ["Holistic", "Gentle Care"],
    icon: Sparkles,
    accent: {
      iconBg: "bg-purple-100",
      iconText: "text-purple-600",
      tagBg: "bg-purple-50",
      tagText: "text-purple-700",
      link: "text-purple-600 hover:text-purple-700",
      hoverBorder: "hover:border-purple-200",
    },
  },
  {
    name: "Naturopathy",
    description:
      "A nature-based approach that supports the body\u2019s own ability to heal itself.",
    tags: ["Wellness", "Prevention"],
    icon: HeartPulse,
    accent: {
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
      tagBg: "bg-amber-50",
      tagText: "text-amber-700",
      link: "text-amber-600 hover:text-amber-700",
      hoverBorder: "hover:border-amber-200",
    },
  },
];
