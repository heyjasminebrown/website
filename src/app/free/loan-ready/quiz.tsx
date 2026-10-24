"use client";

import { useState } from "react";
import { loanQuiz } from "@/content/lead-magnets";
import { FreebieForm } from "../freebie-form";

/** One question at a time, then the signup form that reveals the score. */
export function LoanQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const done = step >= loanQuiz.length;

  if (done) {
    return (
      <FreebieForm
        slug="loan-ready"
        heading="Your score is ready!"
        intro="Where should I send your results and next steps?"
        submitLabel="See my score"
        askPhone
        hidden={answers}
        afterForm={
          <button type="button" onClick={() => setStep(loanQuiz.length - 1)} className="mt-4 text-sm text-muted underline">
            Back to the questions
          </button>
        }
      />
    );
  }

  const q = loanQuiz[step];
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Question {step + 1} of {loanQuiz.length}
        </span>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="underline">
            Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-blush transition-all" style={{ width: `${(step / loanQuiz.length) * 100}%` }} />
      </div>
      <h2 className="mt-6 text-2xl">{q.question}</h2>
      <div className="mt-6 space-y-3">
        {q.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => {
              setAnswers({ ...answers, [q.id]: o.label });
              setStep(step + 1);
            }}
            className={`block w-full rounded-lg border px-4 py-3 text-left hover:border-accent ${
              answers[q.id] === o.label ? "border-accent bg-background" : "border-border bg-surface"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
