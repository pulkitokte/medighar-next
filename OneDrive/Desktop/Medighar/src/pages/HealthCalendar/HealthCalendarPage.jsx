import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useHealthCalendar } from "@/hooks/useHealthCalendar.js";
import {
  EVENT_TYPE_META,
  toDateKey,
  addDays,
} from "@/services/calendar/calendar.service.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const VIEW_OPTIONS = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "timeline", label: "Timeline" },
];

function EventBadge({ event, compact = false }) {
  const navigate = useNavigate();
  const meta = EVENT_TYPE_META[event.type];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => navigate(event.to)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs font-medium transition-colors",
        event.type === "appointment" &&
          "bg-blue-50 text-blue-700 hover:bg-blue-100",
        event.type === "medicine-reminder" &&
          "bg-amber-50 text-amber-700 hover:bg-amber-100",
        event.type === "medical-record" &&
          "bg-purple-50 text-purple-700 hover:bg-purple-100",
      )}
      title={event.title}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">
        {compact && event.time ? `${event.time} · ${event.title}` : event.title}
      </span>
    </button>
  );
}

function FilterToggle({ label, active, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

function MonthGrid({ cursorDate, eventsByDate, today }) {
  const startOfMonthDate = new Date(
    cursorDate.getFullYear(),
    cursorDate.getMonth(),
    1,
  );
  const gridStart = addDays(startOfMonthDate, -startOfMonthDate.getDay());
  const days = Array.from({ length: 42 }, (_, index) =>
    addDays(gridStart, index),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="p-2 text-center text-xs font-semibold text-slate-500"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayEvents = eventsByDate[dateKey] ?? [];
          const isCurrentMonth = day.getMonth() === cursorDate.getMonth();
          const isToday = dateKey === toDateKey(today);

          return (
            <div
              key={dateKey}
              className={cn(
                "flex min-h-[100px] flex-col gap-1 border-b border-r border-slate-100 p-2",
                !isCurrentMonth && "bg-slate-50/50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday
                    ? "bg-blue-600 text-white"
                    : isCurrentMonth
                      ? "text-slate-700"
                      : "text-slate-400",
                )}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-col gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventBadge key={event.id} event={event} />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-xs text-slate-400">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({ cursorDate, eventsByDate, today }) {
  const start = addDays(cursorDate, -cursorDate.getDay());
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const dateKey = toDateKey(day);
        const dayEvents = eventsByDate[dateKey] ?? [];
        const isToday = dateKey === toDateKey(today);

        return (
          <div
            key={dateKey}
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3",
              isToday && "border-blue-300 ring-1 ring-blue-100",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {WEEKDAY_LABELS[day.getDay()]}
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday ? "bg-blue-600 text-white" : "text-slate-700",
                )}
              >
                {day.getDate()}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {dayEvents.length === 0 ? (
                <span className="text-xs text-slate-400">No events</span>
              ) : (
                dayEvents.map((event) => (
                  <EventBadge key={event.id} event={event} compact />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineView({ timelineGroups }) {
  const bucketOrder = ["Today", "Tomorrow", "This Week", "Later"];

  return (
    <div className="flex flex-col gap-8">
      {bucketOrder.map((bucket) => (
        <div key={bucket} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-slate-900">{bucket}</h3>
          {timelineGroups[bucket].length === 0 ? (
            <EmptyRelationship message={`No events ${bucket.toLowerCase()}.`} />
          ) : (
            <div className="flex flex-col gap-2">
              {timelineGroups[bucket].map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-1"
                >
                  <EventBadge event={event} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HealthCalendarPage() {
  const {
    today,
    viewMode,
    setViewMode,
    cursorDate,
    goToToday,
    goToPrevious,
    goToNext,
    visibility,
    setShowAppointments,
    setShowReminders,
    setShowRecords,
    eventsByDate,
    upcomingEvents,
    todayEvents,
    timelineGroups,
  } = useHealthCalendar();

  const monthLabel = cursorDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const todayAppointments = todayEvents.filter(
    (event) => event.type === "appointment",
  );
  const todayReminders = todayEvents.filter(
    (event) => event.type === "medicine-reminder",
  );
  const todayRecords = todayEvents.filter(
    (event) => event.type === "medical-record",
  );

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Health Calendar"
          subtitle="Appointments, medicine reminders, and medical records in one view."
          center
        />

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={viewMode === option.key}
                onClick={() => setViewMode(option.key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  viewMode === option.key
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterToggle
              label="Appointments"
              active={visibility.showAppointments}
              onToggle={() => setShowAppointments((previous) => !previous)}
            />
            <FilterToggle
              label="Reminders"
              active={visibility.showReminders}
              onToggle={() => setShowReminders((previous) => !previous)}
            />
            <FilterToggle
              label="Medical Records"
              active={visibility.showRecords}
              onToggle={() => setShowRecords((previous) => !previous)}
            />
          </div>
        </div>

        {viewMode !== "timeline" && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={goToPrevious}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={goToNext}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              {viewMode === "month"
                ? monthLabel
                : `Week of ${cursorDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
            </h2>
          </div>
        )}

        {viewMode === "month" && (
          <MonthGrid
            cursorDate={cursorDate}
            eventsByDate={eventsByDate}
            today={today}
          />
        )}
        {viewMode === "week" && (
          <WeekGrid
            cursorDate={cursorDate}
            eventsByDate={eventsByDate}
            today={today}
          />
        )}
        {viewMode === "timeline" && (
          <TimelineView timelineGroups={timelineGroups} />
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CalendarDays
                className="h-5 w-5 text-blue-600"
                aria-hidden="true"
              />
              Today&rsquo;s Summary
            </h2>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Appointments ({todayAppointments.length})
                </p>
                {todayAppointments.length === 0 ? (
                  <p className="text-sm text-slate-400">None today.</p>
                ) : (
                  <div className="mt-2 flex flex-col gap-1">
                    {todayAppointments.map((event) => (
                      <EventBadge key={event.id} event={event} compact />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Medicine Reminders ({todayReminders.length})
                </p>
                {todayReminders.length === 0 ? (
                  <p className="text-sm text-slate-400">None today.</p>
                ) : (
                  <div className="mt-2 flex flex-col gap-1">
                    {todayReminders.map((event) => (
                      <EventBadge key={event.id} event={event} compact />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Records ({todayRecords.length})
                </p>
                {todayRecords.length === 0 ? (
                  <p className="text-sm text-slate-400">None today.</p>
                ) : (
                  <div className="mt-2 flex flex-col gap-1">
                    {todayRecords.map((event) => (
                      <EventBadge key={event.id} event={event} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <EmptyRelationship message="No upcoming events in the next 60 days." />
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <EventBadge event={event} compact />
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </Section>
  );
}

export default HealthCalendarPage;
