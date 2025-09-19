import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    const classes = [
      "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700" htmlFor={inputId}>
        {label && <span>{label}</span>}
        <input id={inputId} ref={ref} className={classes} {...props} />
        {helperText && (
          <span className="text-xs font-normal text-slate-500">{helperText}</span>
        )}
      </label>
    );
  },
);

Input.displayName = "Input";
