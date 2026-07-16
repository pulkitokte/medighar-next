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
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import ListSection from "@/shared/components/ui/ListSection.jsx";
import { usePharmacyDetails } from "@/hooks/usePharmacyDetails.js";
import PharmacyNotFound from "@/features/pharmacy/components/PharmacyNotFound.jsx";

function PharmacyDetailsPage() {
  const { pharmacy, notFound } = usePharmacyDetails();

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

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Pharmacy", to: "/pharmacy" },
            { label: pharmacy.name },
          ]}
        />

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"
            aria-hidden="true"
          >
            <Truck className="h-10 w-10" aria-hidden="true" />
          </span>

          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {pharmacy.name}
              </h1>
              {pharmacy.licenseVerified && (
                <BadgeCheck
                  className="h-5 w-5 shrink-0 text-blue-600"
                  aria-label="Verified pharmacy"
                />
              )}
            </div>
            <p className="text-sm font-medium text-blue-600 sm:text-base">
              {pharmacy.type}
            </p>
            <p className="text-sm text-slate-500 sm:text-base">
              {pharmacy.address}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start">
              <Button>Call Pharmacy</Button>
              <Button variant="outline">Get Directions</Button>
            </div>
          </div>
        </div>

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

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">About</h2>
          <p className="text-sm text-slate-600 sm:text-base">
            {pharmacy.description}
          </p>
        </div>

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
      </Container>
    </Section>
  );
}

export default PharmacyDetailsPage;
