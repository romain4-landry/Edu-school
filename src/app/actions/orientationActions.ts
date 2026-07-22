"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerNotificationParent } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DecisionSchema = z.object({
  eleveId: z.string().uuid(),
  filiereProposee: z.string().min(2),
  justification: z.string().min(10),
});

export async function emettreDecisionOrientation(input: z.infer<typeof DecisionSchema>) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHARGE_ORIENTATION") {
    throw new Error("Accès refusé : rôle chargé d'orientation requis.");
  }

  const data = DecisionSchema.parse(input);

  const decision = await prisma.decisionOrientation.create({
    data: {
      eleveId: data.eleveId,
      chargeId: session.user.id,
      filiereProposee: data.filiereProposee,
      justification: data.justification,
    },
  });

  const eleve = await prisma.eleve.findUnique({
    where: { id: data.eleveId },
    include: { parent: true },
  });

  if (eleve?.parent?.email) {
    try {
      await envoyerNotificationParent({
        to: eleve.parent.email,
        eleveNomComplet: `${eleve.prenom} ${eleve.nom}`,
        sujet: "Nouvelle décision d'orientation",
        message: `Une orientation vers la filière <strong>${data.filiereProposee}</strong> a été proposée.<br/><br/>Justification : ${data.justification}`,
      });
    } catch (e) {
      console.error("Échec de l'envoi de la notification email :", e);
    }
  }

  revalidatePath("/orientation");
  revalidatePath(`/parent/eleve/${data.eleveId}`);

  return { id: decision.id };
}

const CommentaireSchema = z.object({
  decisionId: z.string().uuid(),
  contenu: z.string().min(1),
});

export async function commenterDecision(input: z.infer<typeof CommentaireSchema>) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PARENT") {
    throw new Error("Accès refusé : rôle parent requis.");
  }

  const data = CommentaireSchema.parse(input);

  // Vérifie que la décision concerne bien un enfant de ce parent
  const decision = await prisma.decisionOrientation.findUnique({
    where: { id: data.decisionId },
    include: { eleve: true },
  });

  if (!decision || decision.eleve.parentId !== session.user.id) {
    throw new Error("Cette décision ne concerne pas votre enfant.");
  }

  const commentaire = await prisma.commentaire.create({
    data: {
      decisionId: data.decisionId,
      contenu: data.contenu,
    },
  });

  revalidatePath(`/parent/eleve/${decision.eleveId}`);

  return { id: commentaire.id };
}
