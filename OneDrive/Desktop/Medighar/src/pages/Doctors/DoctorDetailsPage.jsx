import {
  BadgeCheck,
  Star,
  Clock,
  MapPin,
  IndianRupee,
  HeartPulse,
  Languages,
  CalendarClock,
  Share2,
  Activity,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { useDoctorDetails } from "@/hooks/useDoctorDetails.js";
import DoctorNotFound from "@/features/doctors/components/DoctorNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-900">{value}</span>
      </div>
    </div>
  );
}

function handleShare() {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(window.location.href).catch(() => {});
}

function DoctorDetailsPage() {
  const { doctor, treatsDiseases, notFound } = useDoctorDetails();

  if (notFound) {
    return (
      <Section paddingY="py-16 sm:py-20">
        <Container>
          <DoctorNotFound />
        </Container>
      </Section>
    );
  }

  if (!doctor) return null;

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-700"
            aria-hidden="true"
          >
            {doctor.initials}
          </span>

          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {doctor.name}
              </h1>
              {doctor.verified && (
                <BadgeCheck
                  className="h-5 w-5 shrink-0 text-blue-600"
                  aria-label="Verified doctor"
                />
              )}
            </div>
            <p className="text-sm text-slate-500 sm:text-base">
              {doctor.qualification}
            </p>
            <p className="text-sm font-medium text-blue-600 sm:text-base">
              {doctor.specialty}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start">
              <Button>Book Appointment</Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={Clock}
            label="Experience"
            value={`${doctor.experienceYears} yrs`}
          />
          <InfoCard
            icon={Star}
            label="Rating"
            value={`${doctor.rating.toFixed(1)} / 5.0`}
          />
          <InfoCard
            icon={IndianRupee}
            label="Consultation Fee"
            value={`\u20B9${doctor.fee}`}
          />
          <InfoCard icon={MapPin} label="City" value={doctor.city} />
          <InfoCard
            icon={HeartPulse}
            label="Healthcare System"
            value={doctor.healthcareSystem}
          />
          <InfoCard
            icon={Languages}
            label="Languages"
            value={doctor.languages.join(", ")}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Biography</h2>
          <p className="text-sm text-slate-600 sm:text-base">
            {doctor.biography}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <CalendarClock
              className="h-5 w-5 text-blue-600"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-slate-900">
              Availability
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {doctor.availability.map((slot) => (
              <li key={slot} className="text-sm text-slate-600 sm:text-base">
                {slot}
              </li>
            ))}
          </ul>
        </div>

        {treatsDiseases.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900">
                Treats Diseases
              </h2>
            </div>
            <DiseaseGrid diseases={treatsDiseases} />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default DoctorDetailsPage;
