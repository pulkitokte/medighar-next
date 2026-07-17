import { useNavigate } from "react-router-dom";
import { Tag, Stethoscope, Biohazard, Gauge } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import SaveButton from "@/shared/components/ui/SaveButton.jsx";

const SEVERITY_CLASSES = {
  Mild: "bg-green-50 text-green-700",
  Moderate: "bg-amber-50 text-amber-700",
  Severe: "bg-red-50 text-red-700",
};

function DiseaseCard({ disease, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/diseases/${disease.id}`);
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
        type="disease"
        id={disease.id}
        className="absolute right-4 top-4"
      />

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {disease.name}
          </h3>
          <p className="text-sm font-medium text-blue-600">
            {disease.specialty}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
            SEVERITY_CLASSES[disease.severity],
          )}
        >
          {disease.severity}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-slate-600">{disease.overview}</p>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {disease.category}
        </div>
        <div className="flex items-center gap-1.5">
          <Stethoscope
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {disease.specialty}
        </div>
        <div className="flex items-center gap-1.5">
          <Biohazard
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {disease.contagious ? "Contagious" : "Not Contagious"}
        </div>
        <div className="flex items-center gap-1.5">
          <Gauge
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {disease.severity}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default DiseaseCard;
