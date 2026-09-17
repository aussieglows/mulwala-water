"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/actions/public";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, {});
  return (
    <form action={action} className="flex flex-col sm:flex-row gap-2 max-w-md">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-white text-ink text-sm"
      />
      <button type="submit" disabled={pending} className="px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-bold cursor-pointer disabled:opacity-50 whitespace-nowrap">
        {pending ? "…" : "Sign up"}
      </button>
      {state?.ok && <span className="text-[13px] text-green font-medium self-center">✓ Subscribed</span>}
      {state?.error && <span className="text-[13px] text-red self-center">{state.error}</span>}
    </form>
  );
}
