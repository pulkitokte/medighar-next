import { useNavigate } from "react-router-dom";
import { BadgeCheck, Star, MapPin, Clock, Truck } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import SaveButton from "@/shared/components/ui/SaveButton.jsx";

function PharmacyCard({ pharmacy, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pharmacy/${pharmacy.id}`);
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <SaveButton
        type="pharmacy"
        id={pharmacy.id}
        className="absolute right-4 top-4"
      />

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {pharmacy.name}
            </h3>
            {pharmacy.licenseVerified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-blue-600"
                aria-label="Verified pharmacy"
              />
            )}
          </div>
          <p className="text-sm font-medium text-blue-600">{pharmacy.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Star
            className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          {pharmacy.rating.toFixed(1)} rating
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {pharmacy.city}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {pharmacy.open24Hours ? "Open 24/7" : pharmacy.timings}
        </div>
        <div className="flex items-center gap-1.5">
          <Truck
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {pharmacy.homeDelivery ? "Delivery Available" : "In-Store Only"}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
        >
          View Pharmacy
        </Button>
      </div>
    </div>
  );
}

export default PharmacyCard;
