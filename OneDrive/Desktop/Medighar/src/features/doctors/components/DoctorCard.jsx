import { useNavigate } from "react-router-dom";
import { BadgeCheck, Star, Clock, MapPin, IndianRupee } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import SaveButton from "@/shared/components/ui/SaveButton.jsx";
import { useDoctorReviews } from "@/hooks/useDoctorReviews.js";

function DoctorCard({ doctor, className }) {
  const navigate = useNavigate();
  const { stats } = useDoctorReviews(doctor.id);

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  const ratingLabel =
    stats.total > 0
      ? `${stats.average.toFixed(1)} (${stats.total} review${stats.total === 1 ? "" : "s"})`
      : `${doctor.rating.toFixed(1)} rating`;

  return (
    <div
      className={cn(
        "card-surface card-surface-hover transition-premium relative flex h-full flex-col gap-5 border border-slate-100 bg-white p-6",
        "hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      <SaveButton type="doctor" id={doctor.id} className="absolute right-5 top-5" />

      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 text-lg font-semibold text-sky-700 shadow-sm">
          {doctor.initials}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pr-10">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {doctor.name}
            </h3>
            {doctor.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-sky-600"
                aria-label="Verified doctor"
              />
            )}
          </div>
          <p className="truncate text-sm text-slate-500">{doctor.qualification}</p>
          <span className="inline-flex w-fit items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            {doctor.specialty}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {doctor.experienceYears} yrs experience
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
          {ratingLabel}
        </div>
        <div className="flex items-center gap-1.5">
          <IndianRupee className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {doctor.fee} consultation
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {doctor.city}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Button size="sm" fullWidth className="rounded-full bg-sky-600 hover:bg-sky-700">
          Book Appointment
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewProfile}
          className="rounded-full border-slate-200 hover:border-sky-200 hover:bg-sky-50"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}

export default DoctorCard;