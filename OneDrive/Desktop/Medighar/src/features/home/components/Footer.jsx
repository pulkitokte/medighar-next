import { NavLink } from "react-router-dom";
import Container from "@/shared/components/ui/Container.jsx";
import Logo from "@/shared/components/common/Logo.jsx";
import { description, copyright } from "@/config/branding.js";
import { QUICK_LINKS, RESOURCE_LINKS } from "@/data/home/footer.js";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-12 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo size="sm" showText />
            <p className="max-w-xs text-sm text-slate-600">{description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
            <ul className="flex flex-col gap-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          {copyright}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
