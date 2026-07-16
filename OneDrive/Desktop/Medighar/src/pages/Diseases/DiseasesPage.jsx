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
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Explore Diseases"
          subtitle="Understand symptoms, causes and treatment options for common conditions."
          center
        />

        <div className="mx-auto w-full max-w-2xl">
          <DiseaseSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <DiseaseFilters value={filters} onChange={setFilters} />

        <div className="flex flex-col gap-6">
          <DiseaseSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState
              title="Loading diseases..."
              description="Finding the best matches for you."
            />
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
