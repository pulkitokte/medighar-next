import { Stethoscope, Pill, Activity, HeartPulse, Store } from "lucide-react";

export const MOCK_RESULTS = [
  {
    id: "result-1",
    type: "doctor",
    icon: Stethoscope,
    title: "Dr. Neha Kapoor",
    description:
      "Cardiologist focused on preventive heart care and long-term patient wellness.",
    badge: { label: "Doctor", variant: "primary" },
    metadata: ["Cardiology", "12 yrs experience", "4.8 rating"],
    cta: "View Profile",
  },
  {
    id: "result-2",
    type: "medicine",
    icon: Pill,
    title: "Paracetamol 500mg",
    description:
      "Commonly used to relieve mild to moderate pain and reduce fever.",
    badge: { label: "Medicine", variant: "success" },
    metadata: ["Tablet", "Over the counter"],
    cta: "View Details",
  },
  {
    id: "result-3",
    type: "disease",
    icon: Activity,
    title: "Type 2 Diabetes",
    description:
      "A chronic condition affecting how the body processes blood sugar.",
    badge: { label: "Disease", variant: "warning" },
    metadata: ["Chronic", "Lifestyle related"],
    cta: "Learn More",
  },
  {
    id: "result-4",
    type: "healthcare-system",
    icon: HeartPulse,
    title: "Ayurveda",
    description:
      "An ancient Indian system that balances body, mind, and spirit through natural remedies.",
    badge: { label: "Healthcare System", variant: "neutral" },
    metadata: ["Natural", "Lifestyle focused"],
    cta: "Explore System",
  },
  {
    id: "result-5",
    type: "pharmacy",
    icon: Store,
    title: "CityCare Pharmacy",
    description:
      "A well-stocked neighborhood pharmacy offering quick access to essential medicines.",
    badge: { label: "Pharmacy", variant: "success" },
    metadata: ["Open 24/7", "1.2 km away"],
    cta: "View Pharmacy",
  },
  {
    id: "result-6",
    type: "doctor",
    icon: Stethoscope,
    title: "Dr. Arjun Rao",
    description:
      "General physician experienced in family medicine and routine health checkups.",
    badge: { label: "Doctor", variant: "primary" },
    metadata: ["General Medicine", "8 yrs experience", "4.6 rating"],
    cta: "View Profile",
  },
  {
    id: "result-7",
    type: "medicine",
    icon: Pill,
    title: "Cetirizine 10mg",
    description: "An antihistamine commonly used to relieve allergy symptoms.",
    badge: { label: "Medicine", variant: "success" },
    metadata: ["Tablet", "Prescription recommended"],
    cta: "View Details",
  },
  {
    id: "result-8",
    type: "disease",
    icon: Activity,
    title: "Seasonal Allergies",
    description:
      "A common immune response to environmental triggers such as pollen and dust.",
    badge: { label: "Disease", variant: "warning" },
    metadata: ["Seasonal", "Mild to moderate"],
    cta: "Learn More",
  },
];
