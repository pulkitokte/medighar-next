import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Stethoscope,
  Pill,
  Activity,
  Store,
  Bookmark,
  History,
  GitCompare,
  CalendarClock,
  Bell,
  BellRing,
  FileText,
  LayoutDashboard,
  Calendar,
  BarChart3,
  IdCard,
  Users,
  Clock3,
  FileBarChart,
  Settings,
  BookUser,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Logo from "@/shared/components/common/Logo.jsx";
import Button from "@/shared/components/ui/Button.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Doctors", to: "/doctors", icon: Stethoscope },
  { label: "Medicines", to: "/medicines", icon: Pill },
  { label: "Diseases", to: "/diseases", icon: Activity },
  { label: "Pharmacy", to: "/pharmacy", icon: Store },
  { label: "Saved", to: "/saved", icon: Bookmark },
  { label: "Recent", to: "/recent", icon: History },
  { label: "Compare", to: "/compare", icon: GitCompare },
  { label: "Appointments", to: "/appointments", icon: CalendarClock },
  { label: "Reminders", to: "/reminders", icon: Bell },
  { label: "Medical Records", to: "/medical-records", icon: FileText },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Calendar", to: "/calendar", icon: Calendar },
  { label: "Insights", to: "/insights", icon: BarChart3 },
  { label: "Medical ID", to: "/medical-profile", icon: IdCard },
  { label: "Family", to: "/family", icon: Users },
  { label: "Timeline", to: "/timeline", icon: Clock3 },
  { label: "Notifications", to: "/notifications", icon: BellRing },
  { label: "Health Reports", to: "/reports", icon: FileBarChart },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Health Passport", to: "/passport", icon: BookUser },
];

function DesktopNavLink({ link }) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        cn(
          "transition-premium relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600",
          "hover:bg-slate-100 hover:text-slate-900",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          isActive && "bg-blue-50 text-blue-700",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {link.label}
    </NavLink>
  );
}

function MobileNavLink({ link, onNavigate }) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700",
          "hover:bg-slate-100",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          isActive && "bg-blue-50 text-blue-700",
        )
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
      {link.label}
    </NavLink>
  );
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center">
          <Logo size="sm" showText />
        </NavLink>

        <nav
          aria-label="Primary navigation"
          className="hide-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex"
        >
          {NAV_LINKS.map((link) => (
            <DesktopNavLink key={link.to} link={link} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex">
            Get Started
          </Button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            className="transition-premium flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <Logo size="sm" showText />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 p-3"
            >
              {NAV_LINKS.map((link) => (
                <MobileNavLink
                  key={link.to}
                  link={link}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto p-4">
              <Button fullWidth onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
