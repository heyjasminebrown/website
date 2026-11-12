// Interest-only payment math for /calculator/interest-only. The rate is a whole-number percentage (7.5 = 7.5%).
// During the interest-only period the payment is interest only; afterwards the loan pays down (principal and
// interest) over the rest of the term. If the interest-only period covers the whole term, the full balance is
// due at the end.

export type InterestOnlyInputs = {
  loanAmount: number;
  rate: number;
  termYears: number;
  interestOnlyYears: number;
};

export const defaultInterestOnlyInputs: InterestOnlyInputs = {
  loanAmount: 0,
  rate: 0,
  termYears: 30,
  interestOnlyYears: 10,
};

/** Monthly principal-and-interest payment that pays off `amount` over `months`. */
function amortizingPayment(amount: number, rate: number, months: number) {
  if (months <= 0) return 0;
  const r = rate / 100 / 12;
  return r === 0 ? amount / months : (amount * r) / (1 - (1 + r) ** -months);
}

export function interestOnly(i: InterestOnlyInputs) {
  const termMonths = Math.round(i.termYears * 12);
  // The interest-only period can't run longer than the loan.
  const ioMonths = Math.min(Math.round(i.interestOnlyYears * 12), termMonths);
  const remainingMonths = termMonths - ioMonths;

  const ioPayment = (i.loanAmount * i.rate) / 100 / 12;
  const ioInterest = ioPayment * ioMonths;
  const laterPayment = amortizingPayment(i.loanAmount, i.rate, remainingMonths);
  const laterInterest = laterPayment * remainingMonths - (remainingMonths ? i.loanAmount : 0);
  const fullyAmortizing = amortizingPayment(i.loanAmount, i.rate, termMonths);

  return {
    termMonths,
    ioMonths,
    remainingMonths,
    ioPayment,
    ioInterest,
    laterPayment,
    // Interest only for the whole term: the balance is paid in one lump sum at the end.
    balloon: remainingMonths === 0 ? i.loanAmount : 0,
    totalInterest: ioInterest + laterInterest,
    fullyAmortizing,
  };
}
