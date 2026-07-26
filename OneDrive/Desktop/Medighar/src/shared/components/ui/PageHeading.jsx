import { cn } from "@/shared/lib/cn.js";

function PageHeading({ title, subtitle, center = true }) {
  return (
    <div className={cn("flex flex-col gap-3", center && "items-center text-center")}>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className={cn("max-w-2xl text-base text-slate-500 sm:text-lg", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeading;