 import { Stethoscope, Pill, Activity, HeartPulse, Store } from 'lucide-react'

export const SEARCH_CATEGORIES = [
  {
    key: 'doctors',
    label: 'Doctors',
    icon: Stethoscope,
    placeholder: 'Search doctors by name or specialty...',
  },
  {
    key: 'medicines',
    label: 'Medicines',
    icon: Pill,
    placeholder: 'Search medicines by name or use...',
  },
  {
    key: 'diseases',
    label: 'Diseases',
    icon: Activity,
    placeholder: 'Search diseases by name or symptom...',
  },
  {
    key: 'healthcare-systems',
    label: 'Healthcare Systems',
    icon: HeartPulse,
    placeholder: 'Search healthcare systems...',
  },
  {
    key: 'pharmacies',
    label: 'Pharmacies',
    icon: Store,
    placeholder: 'Search pharmacies near you...',
  },
]