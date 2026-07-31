import { useNavigate } from "react-router-dom";
import { Activity, Stethoscope, ListChecks } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";

const SEVERITY_STYLES = {
  Mild: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-amber-50 text-amber-700",
  Severe: "bg-rose-50 text-rose-700",
};

function DiseaseCard({ disease, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/diseases/${disease.id}`);
  };

  const symptomCount = disease.symptoms?.length ?? 0;

  return (
    <div
      className={cn(
        "card-surface card-surface-hover transition-premium flex h-full flex-col gap-4 border border-slate-100 bg-white p-6",
        "hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50">
          <Activity className="h-5.5 w-5.5 text-amber-700" aria-hidden="true" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            {disease.name}
          </h3>
          <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            {disease.category}
          </span>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
            SEVERITY_STYLES[disease.severity],
          )}
        >
          {disease.severity}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{disease.overview}</p>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">
          <Stethoscope className="h-3 w-3" aria-hidden="true" />
          {disease.specialty}
        </span>
        {symptomCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">
            <ListChecks className="h-3 w-3" aria-hidden="true" />
            {symptomCount} symptom{symptomCount === 1 ? "" : "s"}
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
            disease.contagious ? "bg-amber-50 text-amber-700" : "bg-stone-50 text-stone-600",
          )}
        >
          {disease.contagious ? "Contagious" : "Not Contagious"}
        </span>
      </div>

      <div className="mt-auto pt-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
          className="rounded-full border-slate-200 hover:border-amber-200 hover:bg-amber-50"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default DiseaseCard;