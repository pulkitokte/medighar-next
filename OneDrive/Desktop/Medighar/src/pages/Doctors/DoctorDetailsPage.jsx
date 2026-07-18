import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import Breadcrumb from "@/shared/components/ui/Breadcrumb.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import TextSection from "@/shared/components/ui/TextSection.jsx";
import ListSection from "@/shared/components/ui/ListSection.jsx";
import RelationSection from "@/shared/components/ui/RelationSection.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useDoctorDetails } from "@/hooks/useDoctorDetails.js";
import { useDoctorReviews } from "@/hooks/useDoctorReviews.js";
import DoctorNotFound from "@/features/doctors/components/DoctorNotFound.jsx";
import DiseaseGrid from "@/features/diseases/components/DiseaseGrid.jsx";

function handleShare() {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(window.location.href).catch(() => {});
}

function StarRating({ value, size = "h-4 w-4" }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            size,
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300",
          )}
        />
      ))}
    </div>
  );
}

function RatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          className="p-0.5"
        >
          <Star
            className={cn(
              "h-6 w-6",
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function DistributionRow({ star, count, total }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-14 shrink-0 text-slate-600">
        {star} star{star === 1 ? "" : "s"}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-slate-500">{count}</span>
    </div>
  );
}

function ReviewCard({ review, onDelete }) {
  const formattedDate = new Date(review.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
          <p className="text-xs text-slate-500">{formattedDate}</p>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p className="text-sm font-medium text-slate-900">{review.title}</p>
      <p className="text-sm text-slate-600">{review.text}</p>
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(review.id)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

const INITIAL_REVIEW_FORM = { name: "", title: "", text: "", rating: 0 };

function DoctorDetailsPage() {
  const { doctor, treatsDiseases, notFound } = useDoctorDetails();
  const navigate = useNavigate();

  const { reviews, stats, submitReview, removeReview } = useDoctorReviews(
    doctor?.id,
  );

  const [formValues, setFormValues] = useState(INITIAL_REVIEW_FORM);
  const [formErrors, setFormErrors] = useState({});

  const updateField = (field, value) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const result = submitReview(formValues);

    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setFormErrors({});
    setFormValues(INITIAL_REVIEW_FORM);
  };

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
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Doctors", to: "/doctors" },
            { label: doctor.name },
          ]}
        />

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
              <Button
                onClick={() => navigate(`/appointments/book/${doctor.id}`)}
              >
                Book Appointment
              </Button>
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

        <TextSection title="Biography" content={doctor.biography} />

        <ListSection
          icon={CalendarClock}
          title="Availability"
          items={doctor.availability}
        />

        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Ratings & Reviews
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-4xl font-semibold text-slate-900">
                {stats.total > 0 ? stats.average.toFixed(1) : "—"}
              </p>
              <StarRating value={stats.average} size="h-5 w-5" />
              <p className="text-sm text-slate-500">
                {stats.total} review{stats.total === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6">
              {[5, 4, 3, 2, 1].map((star) => (
                <DistributionRow
                  key={star}
                  star={star}
                  count={stats.distribution[star]}
                  total={stats.total}
                />
              ))}
            </div>
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h3 className="text-base font-semibold text-slate-900">
              Write a Review
            </h3>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Your Rating
              </span>
              <RatingInput
                value={formValues.rating}
                onChange={(value) => updateField("rating", value)}
              />
              {formErrors.rating && (
                <p className="text-xs text-red-600">{formErrors.rating}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-slate-700">Name</span>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-600">{formErrors.name}</p>
                )}
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-slate-700">Review Title</span>
                <input
                  type="text"
                  value={formValues.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600">{formErrors.title}</p>
                )}
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700">Review</span>
              <textarea
                value={formValues.text}
                onChange={(event) => updateField("text", event.target.value)}
                rows={4}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
              />
              {formErrors.text && (
                <p className="text-xs text-red-600">{formErrors.text}</p>
              )}
            </label>

            <div>
              <Button type="submit">Submit Review</Button>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <EmptyRelationship message="No reviews yet. Be the first to review this doctor." />
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onDelete={removeReview}
                />
              ))
            )}
          </div>
        </section>

        <RelationSection
          icon={Activity}
          title="Treats Diseases"
          items={treatsDiseases}
          emptyMessage="No related diseases found."
          viewAllHref="/diseases"
          renderGrid={(diseases) => <DiseaseGrid diseases={diseases} />}
        />
      </Container>
    </Section>
  );
}

export default DoctorDetailsPage;
