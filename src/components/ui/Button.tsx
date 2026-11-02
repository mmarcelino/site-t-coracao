import clsx from "clsx";

/**
 * Button styles shared by <button>, <a> and next-intl <Link>. Pill shape and semibold label
 * (numa-like), with a quiet hover.
 * Don't pass classes that fight these (display, height): there's no class merging, so pick a
 * `size` instead and handle responsive visibility on a wrapper.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "outline-light";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: "sm" | "md" | "lg" | "fluid" = "md",
  className?: string,
) {
  return clsx(
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold whitespace-nowrap select-none",
    "transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-out",
    "disabled:cursor-not-allowed disabled:opacity-50",
    {
      sm: "h-10 px-5 text-[0.9375rem]",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-[1.0625rem]",
      fluid: "min-h-14 px-8 text-[1.0625rem]",
    }[size],
    {
      primary: "bg-ink text-paper hover:bg-azulejo",
      secondary: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
      ghost: "px-0 h-auto text-ink link-quiet",
      light: "bg-paper text-ink hover:bg-white",
      "outline-light": "border-[1.5px] border-paper text-paper hover:bg-paper hover:text-ink",
    }[variant],
    className,
  );
}
