import {
  Tag,
  Stethoscope,
  Biohazard,
  Gauge,
  ListChecks,
  AlertCircle,
  ShieldAlert,
  Activity,
  ShieldCheck,
  Stethoscope as DiagnosisIcon,
  ClipboardList,
  Pill,
  Link2,
  Store,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import TextSection from "@/shared/components/ui/TextSection.jsx";
import RelationSection from "@/shared/components/ui/RelationSection.jsx";
import { useDiseaseDetails } from "@/hooks/useDiseaseDetails.js";
import DiseaseNotFound from "@/features/diseases/components/DiseaseNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";

const SEVERITY_CLASSES = {
  Mild: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-amber-50 text-amber-700",
  Severe: "bg-rose-50 text-rose-700",
};

/**
 * Disease-specific semantic list wrapper. The shared ListSection component
 * has a fixed white-card presentation with no tone prop, and per this
 * batch's instructions the shared component must not be modified just to
 * support page-specific styling. This small local wrapper exists solely to
 * apply restrained semantic tinting (sand / amber / rose / emerald / slate)
 * to distinguish Symptoms, Causes, Risk Factors, Diagnosis, Complications,
 * and Prevention from one another — a Disease Details–specific need, not a
 * generic one. It renders the same heading/list structure as ListSection,
 * just with a tone-driven surface.
 */
const TONE_SURFACES = {
  sand: "border-stone-100 bg-stone-50/50",
  slate: "border-slate-100 bg-slate-50/50",
  amber: "border-amber-100 bg-amber-50/40",
  rose: "border-rose-100 bg-rose-50/40",
  emerald: "border-emerald-100 bg-emerald-50/40",
};

const TONE_ICON = {
  sand: "text-stone-600",
  slate: "text-slate-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
  emerald: "text-emerald-600",
};

function SemanticListSection({ icon: Icon, title, items, tone = "slate" }) {
  return (
    <div className={cn("card-surface flex flex-col gap-3 border p-6", TONE_SURFACES[tone])}>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", TONE_ICON[tone])} aria-hidden="true" />
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

function DiseaseDetailsPage() {
  const {
    disease,
    recommendedMedicines,
    relatedDiseases,
    recommendedDoctors,
    recommendedPharmacies,
    notFound,
  } = useDiseaseDetails();

  if (notFound) {
    return (
      <Section paddingY="py-16 sm:py-20">
        <Container>
          <DiseaseNotFound />
        </Container>
      </Section>
    );
  }

  if (!disease) return null;

  return (
    <Section paddingY="py-14 sm:py-20" className="bg-gradient-to-b from-amber-50/40 via-white to-white">
      <Container className="flex flex-col gap-12">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Diseases", to: "/diseases" },
            { label: disease.name },
          ]}
        />

        {/* Condition Identity Hero */}
        <div className="card-surface relative overflow-hidden border border-amber-100 bg-white/90 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-orange-50 shadow-sm">
              <Activity className="h-10 w-10 text-amber-700" aria-hidden="true" />
            </span>

            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {disease.name}
                </h1>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", SEVERITY_CLASSES[disease.severity])}>
                  {disease.severity}
                </span>
              </div>

              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                {disease.category}
              </span>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {disease.overview}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-1 text-sm text-slate-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {disease.specialty}
                </span>
                <span className="flex items-center gap-1.5">
                  <Biohazard className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {disease.contagious ? "Contagious" : "Not Contagious"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-slate-900">At a Glance</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={Tag} label="Category" value={disease.category} />
            <InfoCard icon={Stethoscope} label="Specialty" value={disease.specialty} />
            <InfoCard icon={Gauge} label="Severity" value={disease.severity} />
            <InfoCard icon={Biohazard} label="Contagious" value={disease.contagious ? "Yes" : "No"} />
          </div>
        </section>

        {/* Symptoms */}
        <SemanticListSection icon={ListChecks} title="Symptoms" items={disease.symptoms} tone="sand" />

        {/* Causes + Risk Factors, paired on desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SemanticListSection icon={AlertCircle} title="Causes" items={disease.causes} tone="slate" />
          <SemanticListSection icon={ShieldAlert} title="Risk Factors" items={disease.riskFactors} tone="amber" />
        </div>

        {/* Diagnosis */}
        <SemanticListSection icon={DiagnosisIcon} title="Diagnosis" items={disease.diagnosis} tone="slate" />

        {/* Treatment Summary */}
        <TextSection icon={ClipboardList} title="Treatment Summary" content={disease.treatmentSummary} />

        {/* Complications + Prevention, paired on desktop, semantically distinct */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SemanticListSection icon={AlertCircle} title="Complications" items={disease.complications} tone="rose" />
          <SemanticListSection icon={ShieldCheck} title="Prevention" items={disease.prevention} tone="emerald" />
        </div>

        {/* Healthcare Relationships */}
        <div className="flex flex-col gap-10">
          <h2 className="text-base font-semibold text-slate-900">Related Healthcare Information</h2>

          <RelationSection
            icon={Pill}
            title="Recommended Medicines"
            items={recommendedMedicines}
            emptyMessage="No related medicines found."
            viewAllHref="/medicines"
            renderGrid={(medicines) => <MedicineGrid medicines={medicines} />}
          />

          <RelationSection
            icon={Stethoscope}
            title="Recommended Doctors"
            items={recommendedDoctors}
            emptyMessage="No related doctors found."
            viewAllHref="/doctors"
            renderGrid={(doctors) => <DoctorGrid doctors={doctors} />}
          />

          <RelationSection
            icon={Store}
            title="Nearby Pharmacies"
            items={recommendedPharmacies}
            emptyMessage="No nearby pharmacies found."
            viewAllHref="/pharmacy"
            renderGrid={(pharmacies) => <PharmacyGrid pharmacies={pharmacies} />}
          />

          <RelationSection
            icon={Link2}
            title="Related Diseases"
            items={relatedDiseases}
            emptyMessage="No related diseases found."
            viewAllHref="/diseases"
            renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
          />
        </div>
      </Container>
    </Section>
  );
}

export default DiseaseDetailsPage;