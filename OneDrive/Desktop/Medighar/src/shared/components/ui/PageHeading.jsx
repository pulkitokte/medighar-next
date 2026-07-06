import { cn } from "@/shared/lib/cn.js";

function PageHeading({ title, subtitle, center = true }) {
  return (
    <div className={cn(center && "text-center")}>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base text-gray-600 sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}

export default PageHeading;
