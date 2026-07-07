import {
  LayoutGrid,
  Stethoscope,
  Pill,
  Activity,
  HeartPulse,
  Store,
} from "lucide-react";

export const SEARCH_CATEGORIES = [
  {
    key: "all",
    label: "All",
    icon: LayoutGrid,
    placeholder: "Search doctors, medicines, diseases...",
  },
  {
    key: "doctor",
    label: "Doctors",
    icon: Stethoscope,
    placeholder: "Search doctors by name or specialty...",
  },
  {
    key: "medicine",
    label: "Medicines",
    icon: Pill,
    placeholder: "Search medicines by name or use...",
  },
  {
    key: "disease",
    label: "Diseases",
    icon: Activity,
    placeholder: "Search diseases by name or symptom...",
  },
  {
    key: "healthcare-system",
    label: "Healthcare Systems",
    icon: HeartPulse,
    placeholder: "Search healthcare systems...",
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
    icon: Store,
    placeholder: "Search pharmacies near you...",
  },
];
