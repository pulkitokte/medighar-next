import {
  ShieldCheck,
  Tag,
  Layers,
  Beaker,
  Building2,
  Archive,
  ListChecks,
  AlertTriangle,
  ShieldAlert,
  Activity,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import { useMedicineDetails } from "@/hooks/useMedicineDetails.js";
import MedicineNotFound from "@/features/medicine/components/MedicineNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-900">{value}</span>
      </div>
    </div>
  );
}

function ListSection({ icon: Icon, title, items }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-600 sm:text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MedicineDetailsPage() {
  const { medicine, usedForDiseases, notFound } = useMedicineDetails();

  if (notFound) {
    return (
      <Section paddingY="py-16 sm:py-20">
        <Container>
          <MedicineNotFound />
        </Container>
      </Section>
    );
  }

  if (!medicine) return null;

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700"
            aria-hidden="true"
          >
            {medicine.dosageForm}
          </span>

          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {medicine.name}
              </h1>
              {medicine.prescriptionRequired && (
                <ShieldCheck
                  className="h-5 w-5 shrink-0 text-amber-600"
                  aria-label="Prescription required"
                />
              )}
            </div>
            <p className="text-sm text-slate-500 sm:text-base">
              {medicine.genericName}
            </p>
            <p className="text-sm font-medium text-blue-600 sm:text-base">
              {medicine.brand}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={Tag} label="Category" value={medicine.category} />
          <InfoCard
            icon={Layers}
            label="Dosage Form"
            value={medicine.dosageForm}
          />
          <InfoCard icon={Beaker} label="Strength" value={medicine.strength} />
          <InfoCard
            icon={Building2}
            label="Manufacturer"
            value={medicine.manufacturer}
          />
          <InfoCard
            icon={ShieldCheck}
            label="Prescription"
            value={medicine.prescriptionRequired ? "Required" : "Not Required"}
          />
          <InfoCard icon={Archive} label="Storage" value={medicine.storage} />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Description</h2>
          <p className="text-sm text-slate-600 sm:text-base">
            {medicine.description}
          </p>
        </div>

        <ListSection icon={ListChecks} title="Uses" items={medicine.uses} />
        <ListSection
          icon={AlertTriangle}
          title="Side Effects"
          items={medicine.sideEffects}
        />
        <ListSection
          icon={ShieldAlert}
          title="Precautions"
          items={medicine.precautions}
        />

        {usedForDiseases.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900">
                Used For Diseases
              </h2>
            </div>
            <DiseaseGrid diseases={usedForDiseases} />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default MedicineDetailsPage;
