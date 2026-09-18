// Shared presentational primitives for the public site. No business logic.
import Link from "next/link";
import { TrussMark } from "@/components/site/Truss";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  container = true,
}: {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
}) {
  const inner = container ? <Container>{children}</Container> : children;
  return <section className={`py-16 sm:py-20 ${className}`}>{inner}</section>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`t-eyebrow text-brass-deep flex items-center gap-2 m-0 ${className}`}>
      <TrussMark className="w-6 h-auto text-brass" />
      {children}
    </p>
  );
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline transition-colors";
  const styles = {
    primary: "bg-river text-white hover:bg-river-deep",
    secondary: "bg-transparent text-ink border border-ink/20 hover:border-river hover:text-river-deep",
    ghost: "bg-transparent text-river-deep hover:text-river underline-offset-4 hover:underline px-0",
  }[variant];
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

/** A row of list items with truss-mark bullets. */
export function TrussList({ items, className = "" }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={`list-none p-0 m-0 space-y-3 ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 t-body-lg text-ink2">
          <TrussMark className="w-6 h-auto text-brass mt-2 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
