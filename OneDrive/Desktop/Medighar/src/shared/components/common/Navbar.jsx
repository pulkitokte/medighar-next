import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import Logo from "@/shared/components/common/Logo.jsx";
import Button from "@/shared/components/ui/Button.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "Medicines", to: "/medicines" },
  { label: "Diseases", to: "/diseases" },
  { label: "Pharmacy", to: "/pharmacy" },
  { label: "Saved", to: "/saved" },
  { label: "Recent", to: "/recent" },
  { label: "Compare", to: "/compare" },
  { label: "Appointments", to: "/appointments" },
  { label: "Reminders", to: "/reminders" },
  { label: "Medical Records", to: "/medical-records" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Calendar", to: "/calendar" },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center">
          <Logo size="sm" showText />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-slate-600 hover:text-slate-900",
                  isActive && "text-slate-900",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Button size="sm">Get Started</Button>
      </div>
    </header>
  );
}

export default Navbar;
