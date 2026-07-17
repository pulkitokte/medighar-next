import { History, Stethoscope, Pill, Activity, Store } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";
import { useRecentItems } from "@/hooks/useRecentItems.js";

function RecentSection({ icon: Icon, title, items, emptyMessage, renderGrid }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        {title}
      </h2>

      {items.length === 0 ? (
        <EmptyRelationship message={emptyMessage} />
      ) : (
        renderGrid(items)
      )}
    </section>
  );
}

function RecentPage() {
  const {
    recentDoctors,
    recentMedicines,
    recentDiseases,
    recentPharmacies,
    totalCount,
  } = useRecentItems();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Recently Viewed"
          subtitle="Doctors, medicines, diseases and pharmacies you've recently looked at."
          center
        />

        {totalCount === 0 ? (
          <EmptyState
            icon={History}
            title="Nothing viewed yet."
            description="Visit any doctor, medicine, disease or pharmacy to see it show up here."
          />
        ) : (
          <div className="flex flex-col gap-12">
            <RecentSection
              icon={Stethoscope}
              title="Recently Viewed Doctors"
              items={recentDoctors}
              emptyMessage="No recently viewed doctors."
              renderGrid={(doctors) => <DoctorGrid doctors={doctors} />}
            />
            <RecentSection
              icon={Pill}
              title="Recently Viewed Medicines"
              items={recentMedicines}
              emptyMessage="No recently viewed medicines."
              renderGrid={(medicines) => <MedicineGrid medicines={medicines} />}
            />
            <RecentSection
              icon={Activity}
              title="Recently Viewed Diseases"
              items={recentDiseases}
              emptyMessage="No recently viewed diseases."
              renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
            />
            <RecentSection
              icon={Store}
              title="Recently Viewed Pharmacies"
              items={recentPharmacies}
              emptyMessage="No recently viewed pharmacies."
              renderGrid={(pharmacies) => (
                <PharmacyGrid pharmacies={pharmacies} />
              )}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default RecentPage;
