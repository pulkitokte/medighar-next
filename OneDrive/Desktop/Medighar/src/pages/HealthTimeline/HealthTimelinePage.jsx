import { useNavigate } from "react-router-dom";
import {
  Clock3,
  CalendarClock,
  FileText,
  Pill,
  IdCard,
  Users,
  Search,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import { useHealthTimeline } from "@/hooks/useHealthTimeline.js";
import { FILTER_CATEGORIES } from "@/services/timeline/timeline.service.js";

const COLOR_CLASSES = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  cyan: "bg-cyan-50 text-cyan-600",
  pink: "bg-pink-50 text-pink-600",
};

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <span className="text-2xl font-semibold text-slate-900">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}

function TimelineCard({ event }) {
  const navigate = useNavigate();
  const Icon = event.icon;

  const formattedDate = new Date(event.date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <li className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          COLOR_CLASSES[event.color] ?? "bg-slate-100 text-slate-600",
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {event.title}
          </h3>
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>

        {event.description && (
          <p className="mt-1 text-sm text-slate-600">{event.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            {event.memberName} · {event.source}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(event.link)}
            aria-label={`Open ${event.source}`}
          >
            View
          </Button>
        </div>
      </div>
    </li>
  );
}

function HealthTimelinePage() {
  const {
    events,
    stats,
    members,
    categoryFilter,
    setCategoryFilter,
    memberFilter,
    setMemberFilter,
    searchQuery,
    setSearchQuery,
    loading,
    error,
  } = useHealthTimeline();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Health Timeline"
          subtitle="Your entire health history, in chronological order."
          center
        />

        <section
          aria-label="Timeline statistics"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          <StatTile icon={Clock3} label="Total Events" value={stats.total} />
          <StatTile
            icon={CalendarClock}
            label="Appointments"
            value={stats.appointments}
          />
          <StatTile icon={FileText} label="Records" value={stats.records} />
          <StatTile icon={Pill} label="Reminders" value={stats.reminders} />
          <StatTile
            icon={IdCard}
            label="Profile Updates"
            value={stats.profiles}
          />
          <StatTile icon={Users} label="Family Activity" value={stats.family} />
        </section>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
          <div className="flex flex-1 flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Search</span>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Search
                className="h-4 w-4 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by doctor, medicine, record, or member..."
                aria-label="Search timeline events"
                className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <FilterSelect
            label="Member"
            value={memberFilter}
            options={["all", ...members.map((member) => member.id)]}
            onChange={setMemberFilter}
          />

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Category</span>
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  aria-pressed={categoryFilter === category.key}
                  onClick={() => setCategoryFilter(category.key)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    categoryFilter === category.key
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState title="Loading your health timeline..." />
        ) : error ? (
          <ErrorState title="Unable to load timeline" message={error} />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Clock3}
            title="No timeline events found."
            description="Book an appointment, add a medical record, or set a reminder to see activity here."
          />
        ) : (
          <ol
            className="flex flex-col gap-4"
            aria-label="Health timeline events"
          >
            {events.map((event) => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}

export default HealthTimelinePage;
