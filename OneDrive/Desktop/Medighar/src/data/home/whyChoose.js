import {
  ShieldCheck,
  GitCompare,
  UserSearch,
  MapPin,
  Zap,
  HeartHandshake,
} from "lucide-react";

export const FEATURES = [
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
