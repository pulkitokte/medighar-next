import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Stethoscope,
  Pill,
  Activity,
  Store,
  LayoutDashboard,
  Bookmark,
  History,
  GitCompare,
  CalendarClock,
  Bell,
  BellRing,
  FileText,
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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Logo from "@/shared/components/common/Logo.jsx";
import Button from "@/shared/components/ui/Button.jsx";

const PRIMARY_LINKS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Doctors", to: "/doctors", icon: Stethoscope },
  { label: "Medicines", to: "/medicines", icon: Pill },
  { label: "Diseases", to: "/diseases", icon: Activity },
  { label: "Pharmacy", to: "/pharmacy", icon: Store },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
];

const SECONDARY_GROUPS = [
  {
    label: "Personal",
    links: [
      { label: "Saved", to: "/saved", icon: Bookmark },
      { label: "Recently Viewed", to: "/recent", icon: History },
      { label: "Compare Medicines", to: "/compare", icon: GitCompare },
    ],
  },
  {
    label: "Care",
    links: [
      { label: "Appointments", to: "/appointments", icon: CalendarClock },
      { label: "Reminders", to: "/reminders", icon: Bell },
      { label: "Medical Records", to: "/medical-records", icon: FileText },
      { label: "Medical ID", to: "/medical-profile", icon: IdCard },
      { label: "Family", to: "/family", icon: Users },
      { label: "Health Passport", to: "/passport", icon: BookUser },
    ],
  },
  {
    label: "Planning",
    links: [
      { label: "Health Calendar", to: "/calendar", icon: Calendar },
      { label: "Health Insights", to: "/insights", icon: BarChart3 },
      { label: "Health Timeline", to: "/timeline", icon: Clock3 },
      { label: "Health Reports", to: "/reports", icon: FileBarChart },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Notifications", to: "/notifications", icon: BellRing },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

function PrimaryNavLink({ link }) {
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

function MoreMenuLink({ link, onNavigate }) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600",
          "hover:bg-slate-50 hover:text-slate-900",
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

function MoreMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuId = "navbar-more-menu";

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(
          "transition-premium inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600",
          "hover:bg-slate-100 hover:text-slate-900",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          isOpen && "bg-slate-100 text-slate-900",
        )}
      >
        More
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute right-0 top-full z-50 mt-2 w-[560px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/10"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {SECONDARY_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.label}
                </span>
                {group.links.map((link) => (
                  <MoreMenuLink key={link.to} link={link} onNavigate={() => setIsOpen(false)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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
          className="hidden min-w-0 flex-1 items-center gap-1 md:flex"
        >
          {PRIMARY_LINKS.map((link) => (
            <PrimaryNavLink key={link.to} link={link} />
          ))}
          <MoreMenu />
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

            <nav aria-label="Mobile navigation" className="flex flex-col gap-6 p-3">
              <div className="flex flex-col gap-1">
                {PRIMARY_LINKS.map((link) => (
                  <MobileNavLink key={link.to} link={link} onNavigate={() => setIsMobileMenuOpen(false)} />
                ))}
              </div>

              {SECONDARY_GROUPS.map((group) => (
                <div key={group.label} className="flex flex-col gap-1">
                  <span className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {group.label}
                  </span>
                  {group.links.map((link) => (
                    <MobileNavLink key={link.to} link={link} onNavigate={() => setIsMobileMenuOpen(false)} />
                  ))}
                </div>
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