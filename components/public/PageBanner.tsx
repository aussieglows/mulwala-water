// A photo header band (Mulwala Bridge aerial) with a navy overlay for legible white text.
export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bridge-aerial-md.jpg')" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,32,48,0.48) 0%, rgba(20,32,48,0.68) 100%)" }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow">{title}</h1>
        {subtitle && <p className="text-white/85 mt-3 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
