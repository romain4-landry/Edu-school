"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  revalidatePath(`/enseignant/affectation/${data.affectationId}`);
  return note;
}
