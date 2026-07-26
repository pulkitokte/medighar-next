function EmptyRelationship({ message }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500"
    >
      {message}
    </div>
  );
}

export default EmptyRelationship;
