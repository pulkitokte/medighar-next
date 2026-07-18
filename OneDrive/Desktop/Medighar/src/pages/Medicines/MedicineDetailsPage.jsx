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
  Store,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import TextSection from "@/shared/components/ui/TextSection.jsx";
import ListSection from "@/shared/components/ui/ListSection.jsx";
import RelationSection from "@/shared/components/ui/RelationSection.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useMedicineDetails } from "@/hooks/useMedicineDetails.js";
import { useMedicineAvailability } from "@/hooks/useMedicineAvailability.js";
import MedicineNotFound from "@/features/medicine/components/MedicineNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import PharmacyAvailabilityCard from "@/features/pharmacy/components/PharmacyAvailabilityCard.jsx";

const AVAILABILITY_SORT_OPTIONS = [
  { key: "nearest", label: "Nearest" },
  { key: "highest-stock", label: "Highest Stock" },
];

function MedicineDetailsPage() {
  const { medicine, usedForDiseases, notFound } = useMedicineDetails();
  const { entries, inStockOnly, setInStockOnly, sortBy, setSortBy } =
    useMedicineAvailability(medicine?.id);

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
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Medicines", to: "/medicines" },
            { label: medicine.name },
          ]}
        />

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

        <TextSection title="Description" content={medicine.description} />

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

        <RelationSection
          icon={Activity}
          title="Used For Diseases"
          items={usedForDiseases}
          emptyMessage="No related diseases found."
          viewAllHref="/diseases"
          renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Store className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Available At Pharmacies
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={inStockOnly}
                onClick={() => setInStockOnly((previous) => !previous)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  inStockOnly
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                In Stock Only
              </button>

              {AVAILABILITY_SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={sortBy === option.key}
                  onClick={() => setSortBy(option.key)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    sortBy === option.key
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {entries.length === 0 ? (
            <EmptyRelationship message="No pharmacies match the current filter." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <PharmacyAvailabilityCard
                  key={entry.pharmacy.id}
                  pharmacy={entry.pharmacy}
                  status={entry.status}
                  stockLevel={entry.stockLevel}
                  distanceKm={entry.distanceKm}
                />
              ))}
            </div>
          )}
        </section>
      </Container>
    </Section>
  );
}

export default MedicineDetailsPage;
