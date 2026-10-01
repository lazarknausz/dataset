export function Card({ title, children, className = "", id, action }: { title?: React.ReactNode; children: React.ReactNode; className?: string; id?: string; action?: React.ReactNode }) {
  return (
    <section id={id} className={`min-w-0 rounded-xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ChapterHeading({ icon, children, id }: { icon: React.ReactNode; children: React.ReactNode; id: string }) {
  return (
    <div id={id} className="mb-4 mt-12 flex items-center gap-3 rounded-xl bg-surface2 px-5 py-4 first:mt-0">
      <span className="text-accent">{icon}</span>
      <h2 className="text-2xl font-bold text-accent">{children}</h2>
    </div>
  );
}
