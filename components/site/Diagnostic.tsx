"use client";

import { useMemo, useState } from "react";
import { diagnosticQuestions, diagnosticResults, type Cat } from "@/content/diagnostic";
import { Truss, TrussMark } from "@/components/site/Truss";
import { Button } from "@/components/site/ui";

export function Diagnostic() {
  const total = diagnosticQuestions.length;
  const [answers, setAnswers] = useState<(Cat | null)[]>(Array(total).fill(null));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (cat: Cat) => {
    const next = [...answers];
    next[step] = cat;
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else setDone(true);
  };

  const result = useMemo(() => {
    const tally: Record<Cat, number> = { growth: 0, systems: 0, turnaround: 0, "owner-and-exit": 0 };
    answers.forEach((a) => a && (tally[a] += 1));
    // Highest score; ties break by the earliest answer given.
    let top: Cat = "growth";
    let best = -1;
    (Object.keys(tally) as Cat[]).forEach((k) => {
      if (tally[k] > best) { best = tally[k]; top = k; }
    });
    const firstAnswer = answers.find(Boolean) as Cat | undefined;
    if (firstAnswer && tally[firstAnswer] === best) top = firstAnswer;
    return diagnosticResults[top];
  }, [answers]);

  const restart = () => { setAnswers(Array(total).fill(null)); setStep(0); setDone(false); };

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
        <p className="t-eyebrow text-brass-deep m-0">Your starting point</p>
        <h2 className="t-display-md text-ink mt-3 m-0">{result.name}</h2>
        <p className="t-body-lg text-ink2 mt-4 measure">{result.blurb}</p>

        <p className="t-small font-semibold text-ink mt-8 mb-3">Two plays to start with</p>
        <ul className="list-none p-0 m-0 space-y-3">
          {result.plays.map((p) => (
            <li key={p.name} className="flex gap-3">
              <TrussMark className="w-6 h-auto text-brass mt-1.5 shrink-0" />
              <div>
                <p className="t-body-lg text-ink font-medium m-0">{p.name}</p>
                <p className="t-small text-muted m-0">{p.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary">Book a 20-minute call</Button>
          <Button href={result.href} variant="secondary">See the {result.name} plays</Button>
        </div>
        <button onClick={restart} className="mt-6 block t-small text-muted hover:text-river-deep bg-transparent border-0 p-0 cursor-pointer">
          ↻ Start over
        </button>
      </div>
    );
  }

  const current = diagnosticQuestions[step];
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="t-eyebrow text-muted">Question {step + 1} of {total}</span>
        <div className="text-river w-40">
          <Truss spans={total} active={step} className="w-full h-4" strokeWidth={1} />
        </div>
      </div>

      <p className="t-display-md text-ink m-0">{current.q}</p>

      <div className="mt-6 grid gap-3">
        {current.options.map((o) => (
          <button
            key={o.label}
            onClick={() => choose(o.cat)}
            className="text-left rounded-xl border border-line bg-paper px-4 py-3.5 t-body-lg text-ink hover:border-river hover:bg-river-wash/40 transition-colors cursor-pointer"
          >
            {o.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-6 t-small text-muted hover:text-river-deep bg-transparent border-0 p-0 cursor-pointer">
          ← Back
        </button>
      )}
    </div>
  );
}
