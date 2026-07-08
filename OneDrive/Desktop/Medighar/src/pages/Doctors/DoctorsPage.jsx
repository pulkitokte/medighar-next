import { ChevronLeft, ChevronRight } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";
import DoctorFilters from "@/features/doctors/components/DoctorFilters.jsx";
import DoctorSort from "@/features/doctors/components/DoctorSort.jsx";
import DoctorGrid from "@/features/doctors/components/DoctorGrid.jsx";
import DoctorEmptyState from "@/features/doctors/components/DoctorEmptyState.jsx";
import { useDoctors } from "@/hooks/useDoctors.js";

function PaginationPlaceholder() {
  const pages = [1, 2, 3];

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === 1 ? "page" : undefined}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium",
            page === 1
              ? "bg-blue-600 text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

function DoctorsPage() {
  const { doctors, filters, setFilters, sortBy, setSortBy } = useDoctors();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Find Your Doctor"
          subtitle="Browse qualified doctors across specialties, cities and healthcare systems."
          center
        />

        <DoctorFilters value={filters} onChange={setFilters} />

        <div className="flex flex-col gap-6">
          <DoctorSort value={sortBy} onChange={setSortBy} />

          {doctors.length === 0 ? (
            <DoctorEmptyState />
          ) : (
            <DoctorGrid doctors={doctors} />
          )}
        </div>

        <PaginationPlaceholder />
      </Container>
    </Section>
  );
}

export default DoctorsPage;
