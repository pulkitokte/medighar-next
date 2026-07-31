import { useRef } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Tag,
  Layers,
  Beaker,
  Building2,
  Archive,
  ListChecks,
  AlertTriangle,
  Activity,
  Store,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
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

function AmberListSection({ icon: Icon, title, items }) {
  return (
    <div className="card-surface flex flex-col gap-3 border border-amber-100 bg-amber-50/40 p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-amber-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MedicineDetailsPage() {
  const { medicine, usedForDiseases, notFound } = useMedicineDetails();
  const { entries, inStockOnly, setInStockOnly, sortBy, setSortBy } =
    useMedicineAvailability(medicine?.id);
  const availabilityRef = useRef(null);

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

  const scrollToAvailability = () => {
    availabilityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section paddingY="py-14 sm:py-20" className="bg-gradient-to-b from-lime-50/50 via-white to-white">
      <Container className="flex flex-col gap-12">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Medicines", to: "/medicines" },
            { label: medicine.name },
          ]}
        />

        {/* Medicine Hero */}
        <div className="card-surface relative overflow-hidden border border-lime-100 bg-white/90 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-100/50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-lime-100 to-lime-50 shadow-sm">
              <Beaker className="h-11 w-11 text-lime-700" aria-hidden="true" />
            </span>

            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {medicine.name}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    medicine.prescriptionRequired
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {medicine.prescriptionRequired ? "Prescription Required" : "Available Without Prescription"}
                </span>
              </div>

              <p className="text-sm text-slate-500">{medicine.genericName}</p>

              <span className="inline-flex items-center rounded-full bg-lime-50 px-3 py-1 text-sm font-medium text-lime-700">
                {medicine.category}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-slate-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {medicine.dosageForm} · {medicine.strength}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {medicine.manufacturer}
                </span>
                <span className="flex items-center gap-1.5">
                  {medicine.brand}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start">
                <Button onClick={scrollToAvailability} className="rounded-full bg-lime-600 hover:bg-lime-700">
                  <Store className="h-4 w-4" aria-hidden="true" />
                  View Available Pharmacies
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Identity */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-slate-900">Medicine Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={Tag} label="Category" value={medicine.category} />
            <InfoCard icon={Layers} label="Dosage Form" value={medicine.dosageForm} />
            <InfoCard icon={Beaker} label="Strength" value={medicine.strength} />
            <InfoCard icon={Building2} label="Manufacturer" value={medicine.manufacturer} />
            <InfoCard
              icon={ShieldCheck}
              label="Prescription"
              value={medicine.prescriptionRequired ? "Required" : "Not Required"}
            />
            <InfoCard icon={Archive} label="Storage" value={medicine.storage} />
          </div>
        </section>

        <TextSection title="Description" content={medicine.description} />

        <ListSection icon={ListChecks} title="Uses" items={medicine.uses} />

        <AmberListSection icon={AlertTriangle} title="Side Effects" items={medicine.sideEffects} />
        <AmberListSection icon={ShieldAlert} title="Precautions" items={medicine.precautions} />

        <RelationSection
          icon={Activity}
          title="Used For Diseases"
          items={usedForDiseases}
          emptyMessage="No related diseases found."
          viewAllHref="/diseases"
          renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
        />

        {/* Available At Pharmacies */}
        <section ref={availabilityRef} className="flex flex-col gap-4 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Store className="h-5 w-5 text-lime-600" aria-hidden="true" />
              Available At Pharmacies
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={inStockOnly}
                onClick={() => setInStockOnly((previous) => !previous)}
                className={cn(
                  "transition-premium rounded-full border px-4 py-1.5 text-sm font-medium",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600",
                  inStockOnly
                    ? "border-lime-200 bg-lime-100 text-lime-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-lime-200 hover:bg-lime-50",
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
                    "transition-premium rounded-full border px-4 py-1.5 text-sm font-medium",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600",
                    sortBy === option.key
                      ? "border-lime-600 bg-lime-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-lime-200 hover:bg-lime-50",
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