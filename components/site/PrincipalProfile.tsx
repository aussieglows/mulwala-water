import { principal } from "@/content/principal";
import { TrussMark } from "@/components/site/Truss";

// Renders the principal's profile, or a deliberate signed null state (spec Part 6.8).
export function PrincipalProfile() {
  const hasProfile = principal.name && principal.bio;

  if (!hasProfile) {
    // Designed null state — reads as deliberate, not unfinished. No visible [[PLACEHOLDER]].
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 max-w-2xl">
        <TrussMark className="w-9 h-auto text-brass mb-5" />
        <p className="t-body-lg text-ink2 measure m-0">
          Mulwala Water is small on purpose. The person who meets you is the person who does the work —
          a public-company operator who has held the seat, not just advised on it, on both sides of the Pacific.
        </p>
        <p className="t-body-lg text-ink2 measure mt-4 mb-0">
          There&rsquo;s more to this story, and we&rsquo;ll tell you in person. It&rsquo;s the kind of thing that
          reads better across a table than on a page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-8 max-w-3xl flex flex-col sm:flex-row gap-8">
      {principal.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={principal.photo} alt={principal.name ?? ""} className="w-32 h-32 rounded-xl object-cover grayscale shrink-0" />
      )}
      <div>
        <h3 className="t-heading text-ink m-0">{principal.name}</h3>
        {principal.role && <p className="t-small text-brass-deep font-medium mt-1">{principal.role}</p>}
        {principal.bio && <p className="t-body-lg text-ink2 mt-4 measure">{principal.bio}</p>}
        {principal.career.length > 0 && (
          <ul className="list-none p-0 m-0 mt-4 space-y-1.5">
            {principal.career.map((c, i) => (
              <li key={i} className="t-small text-ink2 flex gap-2"><span className="text-brass" aria-hidden>·</span> {c}</li>
            ))}
          </ul>
        )}
        {principal.linkedin && (
          <a href={principal.linkedin} className="inline-block mt-5 t-small font-semibold text-river-deep hover:text-river no-underline" target="_blank" rel="noopener noreferrer">
            LinkedIn →
          </a>
        )}
      </div>
    </div>
  );
}
