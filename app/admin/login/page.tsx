import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-5">
          <div className="text-2xl font-bold text-brand-dark">Mulwala Water</div>
          <p className="text-sm text-muted mt-1">Admin sign-in.</p>
        </div>
        <LoginForm />
        <div className="text-center mt-4">
          <a href="/" className="text-[12px] text-muted no-underline">← Back to website</a>
        </div>
      </div>
    </main>
  );
}
