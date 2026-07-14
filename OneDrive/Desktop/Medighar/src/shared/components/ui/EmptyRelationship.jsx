/**
 * Reusable empty state for a relationship section (e.g. "Recommended
 * Medicines" with no matches). The message is fully caller-supplied so one
 * component covers every relationship type.
 * @param {{ message: string }} props
 */
function EmptyRelationship({ message }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500"
    >
      {message}
    </div>
  );
}

export default EmptyRelationship;
