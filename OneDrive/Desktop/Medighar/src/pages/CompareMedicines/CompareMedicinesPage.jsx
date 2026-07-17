import { useNavigate } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { useComparisonItems } from "@/hooks/useComparisonItems.js";
import { useComparison } from "@/hooks/useComparison.js";
import { MIN_COMPARISON_ITEMS } from "@/services/comparison/comparison.service.js";

const FIELDS = [
  { key: "name", label: "Medicine Name" },
  { key: "genericName", label: "Generic Name" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "dosageForm", label: "Dosage Form" },
  { key: "strength", label: "Strength" },
  { key: "manufacturer", label: "Manufacturer" },
  {
    key: "prescriptionRequired",
    label: "Prescription Required",
    render: (medicine) =>
      medicine.prescriptionRequired ? "Required" : "Not Required",
  },
  { key: "storage", label: "Storage" },
  { key: "uses", label: "Uses", list: true },
  { key: "sideEffects", label: "Side Effects", list: true },
  { key: "precautions", label: "Precautions", list: true },
];

function FieldValue({ medicine, field }) {
  if (field.render) return field.render(medicine);

  const value = medicine[field.key];

  if (field.list && Array.isArray(value)) {
    return (
      <ul className="flex flex-col gap-1">
        {value.map((item) => (
          <li key={item} className="text-sm text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return value;
}

function ComparisonTable({ medicines, onRemove }) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="w-48 shrink-0 p-4 text-sm font-semibold text-slate-500">
              Attribute
            </th>
            {medicines.map((medicine) => (
              <th key={medicine.id} className="p-4 align-top">
                <div className="flex flex-col gap-2">
                  <span className="text-base font-semibold text-slate-900">
                    {medicine.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(medicine.id)}
                    leftIcon={<X className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Remove
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELDS.map((field) => (
            <tr
              key={field.key}
              className="border-b border-slate-100 last:border-0"
            >
              <th
                scope="row"
                className="p-4 align-top text-sm font-medium text-slate-700"
              >
                {field.label}
              </th>
              {medicines.map((medicine) => (
                <td
                  key={medicine.id}
                  className="p-4 align-top text-sm text-slate-600"
                >
                  <FieldValue medicine={medicine} field={field} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCards({ medicines, onRemove }) {
  return (
    <div className="flex flex-col gap-6 md:hidden">
      {medicines.map((medicine) => (
        <div
          key={medicine.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-lg font-semibold text-slate-900">
              {medicine.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(medicine.id)}
              leftIcon={<X className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Remove
            </Button>
          </div>

          <dl className="flex flex-col divide-y divide-slate-100">
            {FIELDS.map((field) => (
              <div
                key={field.key}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {field.label}
                </dt>
                <dd className="text-sm text-slate-700">
                  <FieldValue medicine={medicine} field={field} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function CompareMedicinesPage() {
  const navigate = useNavigate();
  const { medicines, count } = useComparisonItems();
  const { toggle } = useComparison();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Compare Medicines"
          subtitle="Compare up to 4 medicines side-by-side to make an informed choice."
          center
        />

        {count < MIN_COMPARISON_ITEMS ? (
          <EmptyState
            icon={GitCompare}
            title="Select at least 2 medicines to compare."
            description={`You currently have ${count} medicine${count === 1 ? "" : "s"} selected. Browse medicines and tap "Compare" on at least ${MIN_COMPARISON_ITEMS} to see them here.`}
            action={() => navigate("/medicines")}
            actionLabel="Browse Medicines"
          />
        ) : (
          <>
            <ComparisonTable medicines={medicines} onRemove={toggle} />
            <ComparisonCards medicines={medicines} onRemove={toggle} />
          </>
        )}
      </Container>
    </Section>
  );
}

export default CompareMedicinesPage;
