"use server";

import { site } from "@/content/site";
import { getLeadMagnet, loanQuiz, scoreQuiz } from "@/content/lead-magnets";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type FreebieState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
  guidePath?: string;
  quiz?: { score: number; label: string; summary: string; nextSteps: string[] };
};

// Preview deployments link to their own copy of the guide; production links to the real domain.
const baseUrl = () =>
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : site.url;

export async function claimFreebie(_prev: FreebieState, formData: FormData): Promise<FreebieState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim().slice(0, 200);
  const magnet = getLeadMagnet(get("slug"));
  if (!magnet) return { status: "error", message: `Something went wrong. Please email ${site.email} directly.` };

  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Check your inbox!" };

  const isQuiz = magnet.slug === "loan-ready";
  const newsletter = formData.get("newsletter") === "on";
  const values = { name: get("name"), email: get("email"), phone: get("phone"), newsletter: newsletter ? "on" : "" };
  if (!values.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { status: "error", values, message: "Please enter your name and a valid email." };
  }
  if (values.phone && values.phone.replace(/\D/g, "").length < 10) {
    return { status: "error", values, message: "Please enter a full phone number, or leave it blank." };
  }

  // Score on the server rather than trusting a number sent from the browser.
  const answers = Object.fromEntries(loanQuiz.map((q) => [q.id, get(q.id)]));
  const quiz = isQuiz ? scoreQuiz(answers) : undefined;
  if (isQuiz && loanQuiz.some((q) => !answers[q.id])) {
    return { status: "error", values, message: "Please answer every question first." };
  }

  const guidePath = isQuiz ? undefined : `/guides/${magnet.slug}`;
  const quizText = quiz
    ? [
        `Score: ${quiz.score}/100 (${quiz.result.label})`,
        "",
        ...loanQuiz.map((q) => `${q.question}\n  ${answers[q.id]}`),
      ]
    : [];
  const lead = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    ...(values.phone ? [`Phone: ${values.phone}`] : []),
    `Wealthy Notes newsletter: ${newsletter ? "Yes, subscribe me" : "No"}`,
  ];

  const [saved, result] = await Promise.all([
    saveLead({
      source: `Lead magnet: ${magnet.title}`,
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      details: { newsletter, ...(quiz && { score: quiz.score, result: quiz.result.label, answers }) },
    }),
    sendEmail({
      subject: `${magnet.title} lead: ${values.name}${quiz ? ` (scored ${quiz.score})` : ""}`,
      text: [...lead, "", ...quizText].join("\n"),
      replyTo: values.email,
    }),
  ]);
  const success: FreebieState = {
    status: "success",
    message: isQuiz ? `Your results are on their way to ${values.email}.` : `It's on its way to ${values.email}!`,
    guidePath,
    quiz: quiz && { score: quiz.score, ...quiz.result },
  };
  if (result === "logged") return { ...success, message: "Dev mode: lead logged to the server console." };
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && !saved) return { status: "error", values, message: sendFailureMessage(result) };

  await sendEmail({
    to: values.email,
    replyTo: site.email,
    subject: isQuiz ? `Your Loan-Ready score: ${quiz!.score}/100` : `Your ${magnet.title}`,
    text: [
      `Hi ${values.name.split(" ")[0]},`,
      "",
      magnet.emailIntro,
      "",
      ...(quiz
        ? [
            `Your score: ${quiz.score}/100 (${quiz.result.label})`,
            "",
            quiz.result.summary,
            "",
            "Your next steps:",
            ...quiz.result.nextSteps.map((s) => `- ${s}`),
            "",
            "Ready to talk about funding your next deal? Just reply to this email.",
          ]
        : [`${baseUrl()}${guidePath}`, "", "Questions? Just reply to this email, I read every one."]),
      "",
      site.owner,
      site.url,
      ...(quiz ? ["", "This quiz is for general information only and is not a loan offer, commitment to lend, or pre-approval."] : []),
    ].join("\n"),
  });

  return success;
}
