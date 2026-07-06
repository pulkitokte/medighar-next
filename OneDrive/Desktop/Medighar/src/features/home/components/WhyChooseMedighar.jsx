import {
  ShieldCheck,
  GitCompare,
  UserSearch,
  MapPin,
  Zap,
  HeartHandshake,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import { cn } from "@/shared/lib/cn.js";

const FEATURES = [
  {
    title: "Verified Healthcare Information",
    description:
      "Access medically reviewed content you can trust for every health decision.",
    icon: ShieldCheck,
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    title: "Compare Treatment Systems",
    description:
      "Understand and compare different healthcare approaches before you choose.",
    icon: GitCompare,
    iconBg: "bg-green-100",
    iconText: "text-green-600",
  },
  {
    title: "Discover Qualified Doctors",
    description:
      "Find experienced doctors matched to your specific healthcare needs.",
    icon: UserSearch,
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    title: "Find Nearby Pharmacies",
    description:
      "Locate pharmacies close to you for quick and convenient access to medicines.",
    icon: MapPin,
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    title: "Fast Smart Search",
    description:
      "Get relevant results instantly across doctors, diseases and medicines.",
    icon: Zap,
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
  },
  {
    title: "Free & Easy To Use",
    description:
      "Enjoy a simple, intuitive experience with no cost to get started.",
    icon: HeartHandshake,
    iconBg: "bg-pink-100",
    iconText: "text-pink-600",
  },
];

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          feature.iconBg,
        )}
      >
        <Icon className={cn("h-6 w-6", feature.iconText)} aria-hidden="true" />
      </span>

      <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}

function WhyChooseMedighar() {
  return (
    <Section
      paddingY="py-20 sm:py-28"
      className="bg-gradient-to-b from-slate-50 to-white"
    >
      <Container className="flex flex-col items-center gap-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <PageHeading
            title="Why Choose Medighar"
            subtitle="Everything you need to make confident, informed healthcare decisions in one place."
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default WhyChooseMedighar;
