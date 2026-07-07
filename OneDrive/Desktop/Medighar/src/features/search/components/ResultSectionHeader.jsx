function getCountLabel(count) {
  if (count === 0) return "No Results";
  if (count === 1) return "Showing 1 Result";
  return `Showing ${count} Results`;
}

function ResultSectionHeader({ count }) {
  return (
    <div className="flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
        {getCountLabel(count)}
      </h2>
    </div>
  );
}

export default ResultSectionHeader;
