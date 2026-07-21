import { useNavigate } from "react-router-dom";
import { Bell, BellOff, Search, CheckCheck } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import { useNotifications } from "@/hooks/useNotifications.js";
import {
  NOTIFICATION_CATEGORIES,
  PRIORITY_META,
} from "@/services/notifications/notification.service.js";

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

function NotificationCard({ notification, onMarkRead }) {
  const navigate = useNavigate();
  const Icon = notification.icon;
  const priorityMeta = PRIORITY_META[notification.priority];

  const formattedDate = new Date(notification.createdAt).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <li
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-5 shadow-sm",
        notification.read
          ? "border-slate-200 bg-white"
          : "border-blue-200 bg-blue-50/40",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          notification.read
            ? "bg-slate-100 text-slate-500"
            : "bg-blue-100 text-blue-600",
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {notification.title}
          </h3>
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>

        {notification.description && (
          <p className="mt-1 text-sm text-slate-600">
            {notification.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              priorityMeta.className,
            )}
          >
            {priorityMeta.label}
          </span>
          <span className="text-xs text-slate-500">
            {notification.memberName} · {notification.source}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(notification.link)}
          >
            View
          </Button>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(notification.id)}
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

function NotificationCenterPage() {
  const {
    notifications,
    stats,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    markRead,
    markAllRead,
    loading,
    error,
  } = useNotifications();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Notification Center"
          subtitle="Stay on top of appointments, reminders, and health updates."
          center
        />

        <section
          aria-label="Notification statistics"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <StatTile
            icon={Bell}
            label="Total Notifications"
            value={stats.total}
          />
          <StatTile icon={BellOff} label="Unread" value={stats.unread} />
          <div className="flex flex-col items-start justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              leftIcon={
                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              }
            >
              Mark All as Read
            </Button>
          </div>
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
                placeholder="Search notifications..."
                aria-label="Search notifications"
                className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Category</span>
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {NOTIFICATION_CATEGORIES.map((category) => (
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
          <LoadingState title="Loading notifications..." />
        ) : error ? (
          <ErrorState title="Unable to load notifications" message={error} />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications."
            description="You're all caught up. New activity will show up here automatically."
          />
        ) : (
          <ol className="flex flex-col gap-4" aria-label="Notifications">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
              />
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}

export default NotificationCenterPage;
