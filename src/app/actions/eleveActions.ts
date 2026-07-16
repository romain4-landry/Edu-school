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

const EleveSchema = z.object({
  matricule: z.string().min(2),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  dateNaissance: z.string(),
  classeId: z.string().uuid(),
  parentId: z.string().uuid(),
});

export async function creerEleve(input: z.infer<typeof EleveSchema>) {
  await verifierAdmin();
  const data = EleveSchema.parse(input);

  const existant = await prisma.eleve.findUnique({ where: { matricule: data.matricule } });
  if (existant) {
    throw new Error("Ce matricule est déjà utilisé.");
  }

  const eleve = await prisma.eleve.create({
    data: {
      matricule: data.matricule,
      nom: data.nom,
      prenom: data.prenom,
      dateNaissance: new Date(data.dateNaissance),
      classeId: data.classeId,
      parentId: data.parentId,
    },
  });

  revalidatePath("/admin/eleves");
  return eleve;
}

export async function supprimerEleve(id: string) {
  await verifierAdmin();
  await prisma.eleve.delete({ where: { id } });
  revalidatePath("/admin/eleves");
}
