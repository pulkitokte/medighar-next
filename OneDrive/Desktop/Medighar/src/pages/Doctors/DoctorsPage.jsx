import { Stethoscope } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Pagination from "@/shared/components/ui/Pagination.jsx";
import DoctorSearchBar from "@/features/doctors/components/DoctorSearchBar.jsx";
import DoctorFilters from "@/features/doctors/components/DoctorFilters.jsx";
import DoctorSort from "@/features/doctors/components/DoctorSort.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { useDoctors } from "@/hooks/useDoctors.js";

function DoctorsPage() {
  const {
    paginatedDoctors,
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
  } = useDoctors();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Find Your Doctor"
          subtitle="Browse qualified doctors across specialties, cities and healthcare systems."
          center
        />

        <div className="mx-auto w-full max-w-2xl">
          <DoctorSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <DoctorFilters value={filters} onChange={setFilters} />

        <div className="flex flex-col gap-6">
          <DoctorSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <LoadingState
              title="Loading doctors..."
              description="Finding the best matches for you."
            />
          ) : error ? (
            <ErrorState
              title="Unable to load doctors"
              message="Something went wrong while loading the doctor list."
              onRetry={refetch}
            />
          ) : paginatedDoctors.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors found."
              description="Try adjusting your filters to find the right doctor for your needs."
            />
          ) : (
            <DoctorGrid doctors={paginatedDoctors} />
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

export default DoctorsPage;
