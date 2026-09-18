"use client";

import { useActionState } from "react";
import { submitContact } from "@/lib/actions/public";

const field =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-river";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, {});

  if (state.ok) {
    return (
      <div className="rounded-xl border border-line bg-river-wash p-6">
        <p className="t-body-lg text-ink m-0">Thank you — your message is in.</p>
        <p className="t-small text-muted mt-2 mb-0">We read every note ourselves and reply within a business day.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="block t-small font-medium text-ink mb-1.5">Name</label>
          <input id="c-name" name="name" type="text" autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="c-email" className="block t-small font-medium text-ink mb-1.5">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="block t-small font-medium text-ink mb-1.5">What&rsquo;s going on?</label>
        <textarea id="c-message" name="message" rows={5} className={field} placeholder="A sentence or two about your business and what you're stuck on." />
      </div>
      {state.error && <p className="t-small text-[var(--color-red)] m-0">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-river px-6 py-3 text-sm font-semibold text-white hover:bg-river-deep disabled:opacity-60 cursor-pointer"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
