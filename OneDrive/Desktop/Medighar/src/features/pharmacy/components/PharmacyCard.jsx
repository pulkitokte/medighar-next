import { useNavigate } from "react-router-dom";
import { BadgeCheck, Star, MapPin, Clock, Truck, Store } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";

function PharmacyCard({ pharmacy, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pharmacy/${pharmacy.id}`);
  };

  const visibleServices = (pharmacy.services ?? []).slice(0, 2);

  return (
    <div
      className={cn(
        "card-surface card-surface-hover transition-premium flex h-full flex-col gap-5 border border-slate-100 bg-white p-6",
        "hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 shadow-sm">
          <Store className="h-6 w-6 text-violet-700" aria-hidden="true" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {pharmacy.name}
            </h3>
            {pharmacy.licenseVerified && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
            {pharmacy.type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
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

      {visibleServices.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleServices.map((service) => (
            <span
              key={service}
              className="inline-flex items-center rounded-full bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
          className="rounded-full border-slate-200 hover:border-violet-200 hover:bg-violet-50"
        >
          View Pharmacy
        </Button>
      </div>
    </div>
  );
}

export default PharmacyCard;
