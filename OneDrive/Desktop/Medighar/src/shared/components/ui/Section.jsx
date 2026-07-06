import { cn } from "@/shared/lib/cn.js";

function Section({ children, className, paddingY = "py-16" }) {
  return <section className={cn(paddingY, className)}>{children}</section>;
}

export default Section;
