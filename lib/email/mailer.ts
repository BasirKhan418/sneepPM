import nodemailer, { type Transporter } from "nodemailer";

import { env } from "@/lib/config/env";

let transporter: Transporter | undefined;

export function getMailer() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth:
        env.smtp.user && env.smtp.password
          ? {
              user: env.smtp.user,
              pass: env.smtp.password,
            }
          : undefined,
    });
  }

  return transporter;
}

type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendTransactionalEmail(input: TransactionalEmail) {
  return getMailer().sendMail({
    from: env.smtp.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

export function sendInviteEmail(input: {
  to: string;
  inviteUrl: string;
  organizationName: string;
  inviterName: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: `You have been invited to ${input.organizationName}`,
    html: `<p>${input.inviterName} invited you to join ${input.organizationName}.</p><p><a href="${input.inviteUrl}">Accept invite</a></p>`,
    text: `${input.inviterName} invited you to join ${input.organizationName}. Accept the invite at ${input.inviteUrl}`,
  });
}

export function sendNotificationEmail(input: {
  to: string;
  title: string;
  body: string;
  actionUrl?: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: input.title,
    html: `<p>${input.body}</p>${input.actionUrl ? `<p><a href="${input.actionUrl}">Open in Zira</a></p>` : ""}`,
    text: `${input.body}${input.actionUrl ? ` Open in Zira: ${input.actionUrl}` : ""}`,
  });
}

export function sendMeetingReminderEmail(input: {
  to: string;
  title: string;
  joinUrl: string;
  startsAt: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: `Meeting reminder: ${input.title}`,
    html: `<p>${input.title} starts at ${input.startsAt}.</p><p><a href="${input.joinUrl}">Join meeting</a></p>`,
    text: `${input.title} starts at ${input.startsAt}. Join: ${input.joinUrl}`,
  });
}

export function sendPulseDigestEmail(input: {
  to: string;
  subject: string;
  summaryHtml: string;
  summaryText: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: input.subject,
    html: input.summaryHtml,
    text: input.summaryText,
  });
}