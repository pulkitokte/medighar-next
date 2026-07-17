import { Bookmark, Stethoscope, Pill, Activity, Store } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";
import { useSavedItems } from "@/hooks/useSavedItems.js";

function SavedSection({ icon: Icon, title, items, emptyMessage, renderGrid }) {
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

function SavedPage() {
  const {
    savedDoctors,
    savedMedicines,
    savedDiseases,
    savedPharmacies,
    totalCount,
  } = useSavedItems();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Saved"
          subtitle="Doctors, medicines, diseases and pharmacies you've bookmarked for later."
          center
        />

        {totalCount === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet."
            description="Tap the bookmark icon on any doctor, medicine, disease or pharmacy to save it here."
          />
        ) : (
          <div className="flex flex-col gap-12">
            <SavedSection
              icon={Stethoscope}
              title="Saved Doctors"
              items={savedDoctors}
              emptyMessage="No saved doctors yet."
              renderGrid={(doctors) => <DoctorGrid doctors={doctors} />}
            />
            <SavedSection
              icon={Pill}
              title="Saved Medicines"
              items={savedMedicines}
              emptyMessage="No saved medicines yet."
              renderGrid={(medicines) => <MedicineGrid medicines={medicines} />}
            />
            <SavedSection
              icon={Activity}
              title="Saved Diseases"
              items={savedDiseases}
              emptyMessage="No saved diseases yet."
              renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
            />
            <SavedSection
              icon={Store}
              title="Saved Pharmacies"
              items={savedPharmacies}
              emptyMessage="No saved pharmacies yet."
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

export default SavedPage;
