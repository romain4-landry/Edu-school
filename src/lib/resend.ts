import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function envoyerNotificationParent(params: {
  to: string;
  eleveNomComplet: string;
  sujet: string;
  message: string;
}) {
  const { to, eleveNomComplet, sujet, message } = params;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `EDU SCHOOL — ${sujet}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
        <h2 style="color:#00B37D;">EDU SCHOOL</h2>
        <p>Concernant : <strong>${eleveNomComplet}</strong></p>
        <p>${message}</p>
        <hr />
        <p style="font-size:12px;color:#666;">Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    `,
  });
}
