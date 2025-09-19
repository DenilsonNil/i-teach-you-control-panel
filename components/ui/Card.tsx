type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Card({ title, description, children, footer }: CardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {(title || description) && (
        <header className="mb-4">
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </header>
      )}
      <div className="flex flex-col gap-4">{children}</div>
      {footer && <footer className="mt-6 border-t border-slate-100 pt-4">{footer}</footer>}
    </section>
  );
}
