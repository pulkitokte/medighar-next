import { Activity } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Pagination from "@/shared/components/ui/Pagination.jsx";
import DiseaseSearchBar from "@/features/diseases/components/DiseaseSearchBar.jsx";
import DiseaseFilters from "@/features/diseases/components/DiseaseFilters.jsx";
import DiseaseSort from "@/features/diseases/components/DiseaseSort.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { useDiseases } from "@/hooks/useDiseases.js";

function DiseasesPage() {
  const {
    paginatedDiseases,
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
  } = useDiseases();

  return (
    <Section paddingY="py-14 sm:py-20" className="bg-gradient-to-b from-amber-50/40 via-white to-white">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Explore Diseases"
          subtitle="Understand symptoms, causes and treatment options for common conditions."
          center
        />

        <div className="card-surface mx-auto flex w-full max-w-4xl flex-col gap-5 border border-amber-100 bg-white/90 p-5 sm:p-6">
          <DiseaseSearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="h-px w-full bg-amber-50" aria-hidden="true" />
          <DiseaseFilters value={filters} onChange={setFilters} />
        </div>

        <div className="flex flex-col gap-6">
          <DiseaseSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState title="Loading diseases..." description="Finding the best matches for you." />
          ) : error ? (
            <ErrorState
              title="Unable to load diseases"
              message="Something went wrong while loading the disease list."
              onRetry={refetch}
            />
          ) : paginatedDiseases.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No diseases found."
              description="Try adjusting your filters to find the condition you're looking for."
            />
          ) : (
            <DiseaseGrid diseases={paginatedDiseases} />
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

export default DiseasesPage;