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
        "relative flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <SaveButton
        type="doctor"
        id={doctor.id}
        className="absolute right-4 top-4"
      />

      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
          {doctor.initials}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1 pr-10">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {doctor.name}
            </h3>
            {doctor.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-blue-600"
                aria-label="Verified doctor"
              />
            )}
          </div>
          <p className="truncate text-sm text-slate-500">
            {doctor.qualification}
          </p>
          <p className="text-sm font-medium text-blue-600">
            {doctor.specialty}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {doctor.experienceYears} yrs experience
        </div>
        <div className="flex items-center gap-1.5">
          <Star
            className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          {ratingLabel}
        </div>
        <div className="flex items-center gap-1.5">
          <IndianRupee
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {doctor.fee} consultation
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {doctor.city}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
        <Button size="sm" fullWidth>
          Book Appointment
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}

export default DoctorCard;
