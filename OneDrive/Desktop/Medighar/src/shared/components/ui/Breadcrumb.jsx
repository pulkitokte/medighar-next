import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Reusable breadcrumb trail. The last item (or any item without a `to`) is
 * rendered as the current page and is not a link.
 * @param {{ items: Array<{ label: string, to?: string }> }} props
 */
function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-medium text-slate-900"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
