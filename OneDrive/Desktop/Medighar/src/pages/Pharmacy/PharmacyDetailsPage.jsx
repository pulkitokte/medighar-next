import {
  BadgeCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  ListChecks,
  Wrench,
  Pill,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import TextSection from "@/shared/components/ui/TextSection.jsx";
import ListSection from "@/shared/components/ui/ListSection.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { usePharmacyDetails } from "@/hooks/usePharmacyDetails.js";
import { usePharmacyAvailability } from "@/hooks/usePharmacyAvailability.js";
import PharmacyNotFound from "@/features/pharmacy/components/PharmacyNotFound.jsx";
import MedicineAvailabilityCard from "@/features/medicine/components/MedicineAvailabilityCard.jsx";

function PharmacyDetailsPage() {
  const { pharmacy, notFound } = usePharmacyDetails();
  const { entries } = usePharmacyAvailability(pharmacy?.id);

  if (notFound) {
    return (
      <Section paddingY="py-16 sm:py-20">
        <Container>
          <PharmacyNotFound />
        </Container>
      </Section>
    );
  }

  if (!pharmacy) return null;

  const handleCallPharmacy = () => {
    if (typeof window !== "undefined" && pharmacy.phone) {
      window.location.href = `tel:${pharmacy.phone.replace(/\s+/g, "")}`;
    }
  };

  const handleGetDirections = () => {
    if (typeof window === "undefined") return;

    const query = encodeURIComponent(
      `${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}`,
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Section
      paddingY="py-14 sm:py-20"
      className="bg-gradient-to-b from-violet-50/40 via-white to-white"
    >
      <Container className="flex flex-col gap-12">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Pharmacy", to: "/pharmacy" },
            { label: pharmacy.name },
          ]}
        />

        {/* Pharmacy Identity Hero */}
        <div className="card-surface relative overflow-hidden border border-violet-100 bg-white/90 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-violet-50 shadow-sm">
              <Truck className="h-10 w-10 text-violet-700" aria-hidden="true" />
            </span>

            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {pharmacy.name}
                </h1>
                {pharmacy.licenseVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified
                  </span>
                )}
              </div>

              <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                {pharmacy.type}
              </span>

              <p className="text-sm text-slate-500">{pharmacy.address}</p>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-slate-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <MapPin
                    className="h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  {pharmacy.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  {pharmacy.rating.toFixed(1)} rating
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start">
                <Button
                  onClick={handleCallPharmacy}
                  className="rounded-full bg-violet-600 hover:bg-violet-700"
                >
                  Call Pharmacy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGetDirections}
                  className="rounded-full border-slate-200 hover:border-violet-200 hover:bg-violet-50"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Details */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-slate-900">
            Contact &amp; Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={Star}
              label="Rating"
              value={`${pharmacy.rating.toFixed(1)} / 5.0`}
            />
            <InfoCard icon={MapPin} label="City" value={pharmacy.city} />
            <InfoCard
              icon={Clock}
              label="Timings"
              value={pharmacy.open24Hours ? "Open 24/7" : pharmacy.timings}
            />
            <InfoCard icon={Phone} label="Phone" value={pharmacy.phone} />
            <InfoCard icon={Mail} label="Email" value={pharmacy.email} />
            <InfoCard
              icon={Truck}
              label="Home Delivery"
              value={pharmacy.homeDelivery ? "Available" : "Not Available"}
            />
          </div>
        </section>

        <TextSection title="About" content={pharmacy.description} />

        <ListSection
          icon={ListChecks}
          title="Services"
          items={pharmacy.services}
        />
        <ListSection
          icon={Wrench}
          title="Available Facilities"
          items={pharmacy.availableFacilities}
        />
        <ListSection
          icon={ShieldCheck}
          title="Specialties"
          items={pharmacy.specialties}
        />

        {/* Available Medicines */}
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Pill className="h-5 w-5 text-violet-600" aria-hidden="true" />
            Available Medicines
          </h2>

          {entries.length === 0 ? (
            <EmptyRelationship message="No medicine availability listed for this pharmacy." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <MedicineAvailabilityCard
                  key={entry.medicine.id}
                  medicine={entry.medicine}
                  status={entry.status}
                  stockLevel={entry.stockLevel}
                />
              ))}
            </div>
          )}
        </section>
      </Container>
    </Section>
  );
}

export default PharmacyDetailsPage;
