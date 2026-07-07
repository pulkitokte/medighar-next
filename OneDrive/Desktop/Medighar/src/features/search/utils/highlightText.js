import { createElement } from "react";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightText(text, query) {
  if (!text) return text;

  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return text;

  const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === trimmedQuery.toLowerCase();

    if (!isMatch) return part;

    return createElement(
      "mark",
      {
        key: `${part}-${index}`,
        className: "rounded bg-yellow-200 px-1 text-inherit",
      },
      part,
    );
  });
}
