import clsx from "clsx";

/**
 * Button styles shared by <button>, <a> and next-intl <Link>. Square corners and a quiet
 * hover: the UI stays modern and out of the way of the photography.
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
    "inline-flex items-center justify-center gap-2.5 font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-out",
    "disabled:cursor-not-allowed disabled:opacity-50",
    {
      sm: "h-10 px-4 text-[0.9375rem]",
      md: "h-12 px-5 text-[0.9375rem]",
      lg: "h-14 px-7 text-[0.9375rem]",
      fluid: "min-h-14 px-7 text-[0.9375rem]",
    }[size],
    {
      primary: "bg-ink text-paper hover:bg-azulejo",
      secondary: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
      ghost: "px-0 h-auto text-ink link-quiet",
      light: "bg-paper text-ink hover:bg-white",
      "outline-light": "border border-paper/70 text-paper hover:bg-paper hover:text-ink",
    }[variant],
    className,
  );
}
