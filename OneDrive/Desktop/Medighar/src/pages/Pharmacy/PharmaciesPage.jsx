import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import PharmacySearchBar from "@/features/pharmacy/components/PharmacySearchBar.jsx";
import PharmacyFilters from "@/features/pharmacy/components/PharmacyFilters.jsx";
import PharmacySort from "@/features/pharmacy/components/PharmacySort.jsx";
import PharmacyGrid from "@/features/pharmacy/components/PharmacyGrid.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { usePharmacies } from "@/hooks/usePharmacies.js";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium",
            page === currentPage
              ? "bg-blue-600 text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

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
