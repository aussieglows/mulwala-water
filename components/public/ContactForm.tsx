"use client";

import { useActionState } from "react";
import { submitContact } from "@/lib/actions/public";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, {});

  if (state?.ok) {
    return (
      <div className="bg-green-light border border-green/30 rounded-xl p-6 text-center">
        <div className="text-lg font-bold text-ink">Thank you — message received.</div>
        <p className="text-sm text-muted mt-1">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input name="name" type="text" placeholder="Name" className="px-3 py-2.5 rounded-lg border border-border bg-white text-ink text-sm" />
      <input name="email" type="email" required placeholder="Email*" className="px-3 py-2.5 rounded-lg border border-border bg-white text-ink text-sm" />
      <textarea name="message" rows={4} placeholder="Message" className="px-3 py-2.5 rounded-lg border border-border bg-white text-ink text-sm resize-y" />
      {state?.error && <span className="text-[13px] text-red">{state.error}</span>}
      <button type="submit" disabled={pending} className="self-start px-6 py-2.5 rounded-full bg-brand text-white text-sm font-bold cursor-pointer disabled:opacity-50">
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
