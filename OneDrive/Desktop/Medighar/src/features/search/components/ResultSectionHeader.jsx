function ResultSectionHeader({ title = 'Showing Results', count }) {
  return (
    <div className="flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
      {typeof count === 'number' && (
        <p className="text-sm text-slate-500">
          {count} {count === 1 ? 'Result' : 'Results'} Found
        </p>
      )}
    </div>
  )
}

export default ResultSectionHeader