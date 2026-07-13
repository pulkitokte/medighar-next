import { ChevronLeft, ChevronRight } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import MedicineSearchBar from "@/features/medicine/components/MedicineSearchBar.jsx";
import MedicineFilters from "@/features/medicine/components/MedicineFilters.jsx";
import MedicineSort from "@/features/medicine/components/MedicineSort.jsx";
import MedicineGrid from "@/features/medicine/components/MedicineGrid.jsx";
import MedicineEmptyState from "@/features/medicine/components/MedicineEmptyState.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import { useMedicines } from "@/hooks/useMedicines.js";

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
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Find Your Medicine"
          subtitle="Browse medicines by category, dosage form and prescription requirement."
          center
        />

        <div className="mx-auto w-full max-w-2xl">
          <MedicineSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <MedicineFilters value={filters} onChange={setFilters} />

        <div className="flex flex-col gap-6">
          <MedicineSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState label="Loading medicines..." />
          ) : error ? (
            <ErrorState
              title="Unable to load medicines"
              description="Something went wrong while loading the medicine list."
              retry={refetch}
            />
          ) : paginatedMedicines.length === 0 ? (
            <MedicineEmptyState />
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
