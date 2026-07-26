import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";

const MAX_RELATED_ITEMS = 3;

function RelationSection({
  icon: Icon,
  title,
  items = [],
  emptyMessage,
  viewAllHref,
  renderGrid,
}) {
  const navigate = useNavigate();
  const headingId = useId();
  const visibleItems = items.slice(0, MAX_RELATED_ITEMS);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id={headingId}
          className="flex items-center gap-2 text-lg font-semibold text-slate-900"
        >
          <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          {title}
        </h2>

        {viewAllHref && items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(viewAllHref)}
            rightIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
          >
            View All
            <span className="sr-only"> {title}</span>
          </Button>
        )}
      </div>

      {visibleItems.length === 0 ? (
        <EmptyRelationship message={emptyMessage} />
      ) : (
        renderGrid(visibleItems)
      )}
    </section>
  );
}

export default RelationSection;
