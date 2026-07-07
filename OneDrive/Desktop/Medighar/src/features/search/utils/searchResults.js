function getRating(result) {
  const ratingEntry = result.metadata?.find((item) => /rating/i.test(item));
  if (!ratingEntry) return 0;

  const value = parseFloat(ratingEntry);
  return Number.isNaN(value) ? 0 : value;
}

function sortResults(results, filter) {
  const list = [...results];

  switch (filter) {
    case "nearby":
      return list.sort(
        (a, b) =>
          a.type.localeCompare(b.type) || a.title.localeCompare(b.title),
      );

    case "popular":
      return list.sort((a, b) => a.title.localeCompare(b.title));

    case "verified": {
      const rank = { primary: 0, success: 1, warning: 2, neutral: 3 };
      return list.sort((a, b) => {
        const rankA = rank[a.badge?.variant] ?? 4;
        const rankB = rank[b.badge?.variant] ?? 4;
        return rankA - rankB;
      });
    }

    case "top-rated":
      return list.sort(
        (a, b) => getRating(b) - getRating(a) || a.title.localeCompare(b.title),
      );

    case "all":
    default:
      return list;
  }
}

export function filterSearchResults({
  query = "",
  category = "all",
  filter = "all",
  results = [],
}) {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = results.filter((result) => {
    const matchesCategory = category === "all" || result.type === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      result.title,
      result.description,
      ...(result.metadata ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return sortResults(filtered, filter);
}
