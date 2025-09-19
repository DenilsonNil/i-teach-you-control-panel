type ListProps = {
  items: string[];
  emptyMessage?: string;
};

export function List({ items, emptyMessage = "Nenhum item disponível." }: ListProps) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item}>seu item:  {item}</li>
      ))}
    </ul>
  );
}
