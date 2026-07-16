import { Store } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Pagination from "@/shared/components/ui/Pagination.jsx";
import PharmacySearchBar from "@/features/pharmacy/components/PharmacySearchBar.jsx";
import PharmacyFilters from "@/features/pharmacy/components/PharmacyFilters.jsx";
import PharmacySort from "@/features/pharmacy/components/PharmacySort.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { usePharmacies } from "@/hooks/usePharmacies.js";

function PharmaciesPage() {
  const {
    paginatedPharmacies,
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
  } = usePharmacies();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Find a Pharmacy"
          subtitle="Locate pharmacies near you for quick and convenient access to medicines."
          center
        />

        <div className="mx-auto w-full max-w-2xl">
          <PharmacySearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <PharmacyFilters value={filters} onChange={setFilters} />

        <div className="flex flex-col gap-6">
          <PharmacySort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState
              title="Loading pharmacies..."
              description="Finding the best matches for you."
            />
          ) : error ? (
            <ErrorState
              title="Unable to load pharmacies"
              message="Something went wrong while loading the pharmacy list."
              onRetry={refetch}
            />
          ) : paginatedPharmacies.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No pharmacies found."
              description="Try adjusting your filters to find a pharmacy near you."
            />
          ) : (
            <PharmacyGrid pharmacies={paginatedPharmacies} />
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

export default PharmaciesPage;
