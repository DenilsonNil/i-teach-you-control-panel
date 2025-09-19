import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-900 focus-visible:ring-slate-400",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-900 focus-visible:ring-slate-400",
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const widthStyles = fullWidth ? "w-full" : "";
  const classes = [baseStyles, VARIANT_STYLES[variant], widthStyles, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props} />
  );
}
