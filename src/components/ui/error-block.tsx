interface ErrorBlockProps {
  title: string;
  description: string;
}

export function ErrorBlock({ title, description }: ErrorBlockProps) {
  return (
    <div className="rounded-xl border border-border p-6 text-center">
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
