"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerNotificationParent } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SaisieNoteSchema = z.object({
  eleveId: z.string().uuid(),
  affectationId: z.string().uuid(),
  valeur: z.coerce.number().min(0).max(20),
  sequence: z.enum(["S1", "S2", "S3", "S4", "S5", "S6"]),
});

export async function saisirNote(input: z.infer<typeof SaisieNoteSchema>) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ENSEIGNANT") {
    throw new Error("Accès refusé : rôle enseignant requis.");
  }

  const data = SaisieNoteSchema.parse(input);

  const affectation = await prisma.affectation.findUnique({
    where: { id: data.affectationId },
    include: { matiere: true },
  });

  if (!affectation || affectation.enseignantId !== session.user.id) {
    throw new Error("Cette affectation ne vous appartient pas.");
  }

  const note = await prisma.note.create({
    data: {
      eleveId: data.eleveId,
      affectationId: data.affectationId,
      valeur: data.valeur,
      sequence: data.sequence,
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
        sujet: "Nouvelle note enregistrée",
        message: `Une nouvelle note de <strong>${data.valeur}/20</strong> a été enregistrée en <strong>${affectation.matiere.nom}</strong> pour la séquence ${data.sequence}.`,
      });
      console.log(`Email de notification envoyé à ${eleve.parent.email}`);
    } catch (e) {
      console.error("Échec de l'envoi de la notification email :", e);
    }
  }

  revalidatePath(`/enseignant/affectation/${data.affectationId}`);

  // On ne retourne que des types simples (pas l'objet Prisma brut avec son Decimal)
  return {
    id: note.id,
    valeur: Number(note.valeur),
    sequence: note.sequence,
  };
}
