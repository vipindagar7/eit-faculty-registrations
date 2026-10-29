/** Numbered section used by the Privacy and Cookie policy pages. */
export function PolicySection({ id, n, title, children }) {
  return (
    <section id={id} className="scroll-mt-8 space-y-3">
      <h2 className="font-display flex items-baseline gap-3 text-xl font-semibold">
        <span className="font-mono text-sm text-accent">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/85 [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
