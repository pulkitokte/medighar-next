import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellOff,
  Search,
  CheckCheck,
  Trash2,
  X,
  Activity,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import LoadingState from "@/shared/components/ui/LoadingState.jsx";
import ErrorState from "@/shared/components/ui/ErrorState.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useNotifications } from "@/hooks/useNotifications.js";
import {
  FILTER_OPTIONS,
  PRIORITY_META,
  formatRelativeTime,
} from "@/services/notifications/notification.service.js";

const RECENCY_GROUPS = ["Today", "Yesterday", "This Week", "Older"];

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

function RelativeTime({ timestamp }) {
  const label = formatRelativeTime(timestamp);
  return (
    <time
      dateTime={new Date(timestamp).toISOString()}
      aria-label={label}
      className="text-xs text-slate-400"
    >
      {label}
    </time>
  );
}

function NotificationCard({ notification, onMarkRead, onDismiss }) {
  const navigate = useNavigate();
  const Icon = notification.icon;
  const priorityMeta = PRIORITY_META[notification.priority];

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
          <RelativeTime timestamp={notification.createdAt} />
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(notification.id)}
            leftIcon={<X className="h-3.5 w-3.5" aria-hidden="true" />}
            aria-label={`Dismiss notification: ${notification.title}`}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </li>
  );
}

function ActivityFeedItem({ item }) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <li className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
          <RelativeTime timestamp={item.timestamp} />
        </div>

        {item.description && (
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500">{item.memberName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(item.link)}
          >
            View
          </Button>
        </div>
      </div>
    </li>
  );
}

function NotificationCenterPage() {
  const {
    notifications,
    groupedNotifications,
    activityFeed,
    stats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
    loading,
    error,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("notifications");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeout = setTimeout(() => setStatusMessage(""), 2500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const handleMarkRead = (id) => {
    markRead(id);
    setStatusMessage("Notification marked as read.");
  };

  const handleDismiss = (id) => {
    dismiss(id);
    setStatusMessage("Notification dismissed.");
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setStatusMessage("All notifications marked as read.");
  };

  const handleClearAll = () => {
    clearAll();
    setStatusMessage("All notifications cleared.");
  };

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Notification Center"
          subtitle="Stay on top of appointments, reminders, and health updates."
          center
        />

        <p role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        <section
          aria-label="Notification statistics"
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
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
              onClick={handleMarkAllRead}
              leftIcon={
                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              }
            >
              Mark All as Read
            </Button>
          </div>
          <div className="flex flex-col items-start justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Clear All
            </Button>
          </div>
        </section>

        <div
          role="tablist"
          aria-label="Notification view"
          className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5"
        >
          <button
            type="button"
            role="tab"
            id="tab-notifications"
            aria-selected={activeTab === "notifications"}
            aria-controls="panel-notifications"
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "notifications"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            Notifications
          </button>
          <button
            type="button"
            role="tab"
            id="tab-activity"
            aria-selected={activeTab === "activity"}
            aria-controls="panel-activity"
            onClick={() => setActiveTab("activity")}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "activity"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            Activity Feed
          </button>
        </div>

        {activeTab === "notifications" ? (
          <div
            id="panel-notifications"
            role="tabpanel"
            aria-labelledby="tab-notifications"
            className="flex flex-col gap-8"
          >
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
                <span className="font-medium text-slate-700">Filter</span>
                <div
                  className="flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label="Filter notifications"
                >
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      aria-pressed={activeFilter === option.key}
                      onClick={() => setActiveFilter(option.key)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        activeFilter === option.key
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingState title="Loading notifications..." />
            ) : error ? (
              <ErrorState
                title="Unable to load notifications"
                message={error}
              />
            ) : notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications."
                description="You're all caught up. New activity will show up here automatically."
              />
            ) : (
              <div className="flex flex-col gap-8">
                {RECENCY_GROUPS.map((group) =>
                  groupedNotifications[group].length === 0 ? null : (
                    <section key={group} className="flex flex-col gap-4">
                      <h2 className="text-base font-semibold text-slate-900">
                        {group}
                      </h2>
                      <ol
                        className="flex flex-col gap-4"
                        aria-label={`${group} notifications`}
                      >
                        {groupedNotifications[group].map((notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                            onDismiss={handleDismiss}
                          />
                        ))}
                      </ol>
                    </section>
                  ),
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            id="panel-activity"
            role="tabpanel"
            aria-labelledby="tab-activity"
            className="flex flex-col gap-4"
          >
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Recent Activity
            </h2>

            {activityFeed.length === 0 ? (
              <EmptyRelationship message="No recent activity." />
            ) : (
              <ol className="flex flex-col gap-4" aria-label="Activity feed">
                {activityFeed.map((item) => (
                  <ActivityFeedItem key={item.id} item={item} />
                ))}
              </ol>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}

export default NotificationCenterPage;
