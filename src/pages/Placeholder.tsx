type PlaceholderProps = {
  title: string;
  note: string;
};

export function Placeholder({ title, note }: PlaceholderProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-4 max-w-xl text-muted">{note}</p>
    </section>
  );
}
