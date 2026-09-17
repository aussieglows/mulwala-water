"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Passcode
        <input
          name="passcode"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="px-3 py-2 border border-border rounded-lg text-base bg-white"
        />
      </label>
      {state?.error && <div className="text-sm text-red">{state.error}</div>}
      <button
        type="submit"
        disabled={pending}
        className="bg-brand text-white border-none rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
