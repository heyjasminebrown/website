import { passiveGuide } from "@/content/lead-magnets";
import { passiveIncome } from "@/content/site";
import { GuideShell, guideMetadata } from "../guide-shell";

export const metadata = guideMetadata("passive-income-guide");

export default function PassiveIncomeGuide() {
  return (
    <GuideShell
      slug="passive-income-guide"
      intro="A plain-English introduction to earning income from real estate without managing properties yourself."
    >
      {passiveGuide.sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-2xl">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="mt-4">{p}</p>
          ))}
        </section>
      ))}
      <section className="break-inside-avoid">
        <h2 className="text-2xl">10 questions to ask before you invest</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6">
          {passiveGuide.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>
      <p className="text-xs text-muted">
        This guide is for educational purposes only and is not investment, legal or tax advice. {passiveIncome.disclaimer}
      </p>
    </GuideShell>
  );
}
