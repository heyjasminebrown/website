"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
    >
      Print or save as PDF
    </button>
  );
}
