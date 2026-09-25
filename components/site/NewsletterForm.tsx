"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/actions/public";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, {});

  if (state.ok) {
    return <p className="t-small text-river-deep m-0">Thanks — you&rsquo;re on the list.</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-2 max-w-xs">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex gap-2">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="flex-1 min-w-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-river"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-river px-3 py-2 text-sm font-semibold text-white hover:bg-river-deep disabled:opacity-60 cursor-pointer shrink-0"
        >
          {pending ? "…" : "Sign up"}
        </button>
      </div>
      {state.error && <p className="t-small text-[var(--color-red)] m-0">{state.error}</p>}
    </form>
  );
}
