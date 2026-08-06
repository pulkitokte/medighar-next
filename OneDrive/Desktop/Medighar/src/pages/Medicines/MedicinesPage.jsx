import { Pill } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Pagination from "@/shared/components/ui/Pagination.jsx";
import SearchHint from "@/shared/components/ui/SearchHint.jsx";
import MedicineSearchBar from "@/features/medicine/components/MedicineSearchBar.jsx";
import MedicineFilters from "@/features/medicine/components/MedicineFilters.jsx";
import MedicineSort from "@/features/medicine/components/MedicineSort.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { useMedicines } from "@/hooks/useMedicines.js";

function MedicinesPage() {
  const {
    paginatedMedicines,
    loading,
    error,
    refetch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useMedicines();

  return (
    <Section
      paddingY="py-14 sm:py-20"
      className="bg-gradient-to-b from-lime-50/50 via-white to-white"
    >
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Find Your Medicine"
          subtitle="Browse verified medicine information by category, dosage form and prescription requirement."
          center
        />

        <div className="card-surface mx-auto flex w-full max-w-4xl flex-col gap-5 border border-lime-100 bg-white/90 p-5 sm:p-6">
          <MedicineSearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="h-px w-full bg-lime-50" aria-hidden="true" />
          <MedicineFilters value={filters} onChange={setFilters} />
        </div>

        <div className="flex justify-center">
          <SearchHint />
        </div>

        <div className="flex flex-col gap-6">
          <MedicineSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState
              title="Loading medicines..."
              description="Finding the best matches for you."
            />
          ) : error ? (
            <ErrorState
              title="Unable to load medicines"
              message="Something went wrong while loading the medicine list."
              onRetry={refetch}
            />
          ) : paginatedMedicines.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medicines found."
              description="Try adjusting your filters to find the medicine you're looking for."
            />
          ) : (
            <MedicineGrid medicines={paginatedMedicines} />
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>
    </Section>
  );
}

export default MedicinesPage;
