"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function verifierAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Accès refusé : rôle administrateur requis.");
  }
  return session;
}

const AffectationSchema = z.object({
  enseignantId: z.string().uuid(),
  matiereId: z.string().uuid(),
  classeId: z.string().uuid(),
  anneeScolaireId: z.string().uuid(),
});

export async function creerAffectation(input: z.infer<typeof AffectationSchema>) {
  await verifierAdmin();
  const data = AffectationSchema.parse(input);

  const existante = await prisma.affectation.findUnique({
    where: {
      enseignantId_matiereId_classeId_anneeScolaireId: data,
    },
  });
  if (existante) {
    throw new Error("Cette affectation existe déjà.");
  }

  const affectation = await prisma.affectation.create({ data });
  revalidatePath("/admin/affectations");
  return affectation;
}

export async function supprimerAffectation(id: string) {
  await verifierAdmin();
  await prisma.affectation.delete({ where: { id } });
  revalidatePath("/admin/affectations");
}
