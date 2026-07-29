import { NavLink } from "react-router-dom";
import Container from "@/shared/components/ui/Container.jsx";
import Logo from "@/shared/components/common/Logo.jsx";
import { description, copyright } from "@/config/branding.js";
import { QUICK_LINKS, RESOURCE_LINKS } from "@/data/home/footer.js";

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white">
      <Container className="flex flex-col gap-14 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo size="sm" showText />
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">{description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="transition-premium rounded text-sm text-slate-600 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Resources
            </h3>
            <ul className="flex flex-col gap-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="transition-premium rounded text-sm text-slate-600 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-slate-100 pt-8 text-center">
          <p className="text-xs text-slate-400">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;