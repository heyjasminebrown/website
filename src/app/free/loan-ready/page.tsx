import { FreebieLanding, freebieMetadata } from "../freebie-landing";
import { LoanQuiz } from "./quiz";

export const metadata = freebieMetadata("loan-ready");

export default function LoanReadyPage() {
  return (
    <>
      <FreebieLanding slug="loan-ready">
        <LoanQuiz />
      </FreebieLanding>
      <p className="mx-auto max-w-5xl px-4 pb-16 text-xs text-muted sm:px-6">
        This quiz is for general information only. Your score is not a loan offer, commitment to lend, or
        pre-approval, and actual loan terms depend on a full review of you and the property.
      </p>
    </>
  );
}
