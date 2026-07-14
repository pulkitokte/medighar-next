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
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import RelationSection from "@/shared/components/ui/RelationSection.jsx";
import { useDiseaseDetails } from "@/hooks/useDiseaseDetails.js";
import DiseaseNotFound from "@/features/diseases/components/DiseaseNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";

const SEVERITY_CLASSES = {
  Mild: "bg-green-50 text-green-700",
  Moderate: "bg-amber-50 text-amber-700",
  Severe: "bg-red-50 text-red-700",
};

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
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Diseases", to: "/diseases" },
            { label: disease.name },
          ]}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"
            aria-hidden="true"
          >
            <Activity className="h-10 w-10" aria-hidden="true" />
          </span>

          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {disease.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${SEVERITY_CLASSES[disease.severity]}`}
              >
                {disease.severity}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-600 sm:text-base">
              {disease.category}
            </p>
            <p className="text-sm text-slate-600 sm:text-base">
              {disease.overview}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={Tag} label="Category" value={disease.category} />
          <InfoCard
            icon={Stethoscope}
            label="Specialty"
            value={disease.specialty}
          />
          <InfoCard icon={Gauge} label="Severity" value={disease.severity} />
          <InfoCard
            icon={Biohazard}
            label="Contagious"
            value={disease.contagious ? "Yes" : "No"}
          />
        </div>

        <ListSection
          icon={ListChecks}
          title="Symptoms"
          items={disease.symptoms}
        />
        <ListSection icon={AlertCircle} title="Causes" items={disease.causes} />
        <ListSection
          icon={ShieldAlert}
          title="Risk Factors"
          items={disease.riskFactors}
        />
        <ListSection
          icon={AlertCircle}
          title="Complications"
          items={disease.complications}
        />
        <ListSection
          icon={ShieldCheck}
          title="Prevention"
          items={disease.prevention}
        />
        <ListSection
          icon={DiagnosisIcon}
          title="Diagnosis"
          items={disease.diagnosis}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <ClipboardList
              className="h-5 w-5 text-blue-600"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-slate-900">
              Treatment Summary
            </h2>
          </div>
          <p className="text-sm text-slate-600 sm:text-base">
            {disease.treatmentSummary}
          </p>
        </div>

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
      </Container>
    </Section>
  );
}

export default DiseaseDetailsPage;
