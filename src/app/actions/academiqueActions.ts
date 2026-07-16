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

// ---------- Établissements ----------

const EtablissementSchema = z.object({
  nom: z.string().min(2),
  ville: z.string().min(2),
});

export async function creerEtablissement(input: z.infer<typeof EtablissementSchema>) {
  await verifierAdmin();
  const data = EtablissementSchema.parse(input);

  const etablissement = await prisma.etablissement.create({ data });
  revalidatePath("/admin/academique");
  return etablissement;
}

export async function supprimerEtablissement(id: string) {
  await verifierAdmin();
  await prisma.etablissement.delete({ where: { id } });
  revalidatePath("/admin/academique");
}

// ---------- Années scolaires ----------

const AnneeScolaireSchema = z.object({
  libelle: z.string().min(4),
  dateDebut: z.string(),
  dateFin: z.string(),
});

export async function creerAnneeScolaire(input: z.infer<typeof AnneeScolaireSchema>) {
  await verifierAdmin();
  const data = AnneeScolaireSchema.parse(input);

  const anneeScolaire = await prisma.anneeScolaire.create({
    data: {
      libelle: data.libelle,
      dateDebut: new Date(data.dateDebut),
      dateFin: new Date(data.dateFin),
    },
  });
  revalidatePath("/admin/academique");
  return anneeScolaire;
}

export async function supprimerAnneeScolaire(id: string) {
  await verifierAdmin();
  await prisma.anneeScolaire.delete({ where: { id } });
  revalidatePath("/admin/academique");
}

// ---------- Classes ----------

const ClasseSchema = z.object({
  nom: z.string().min(1),
  niveau: z.string().min(1),
  etablissementId: z.string().uuid(),
});

export async function creerClasse(input: z.infer<typeof ClasseSchema>) {
  await verifierAdmin();
  const data = ClasseSchema.parse(input);

  const classe = await prisma.classe.create({ data });
  revalidatePath("/admin/academique");
  return classe;
}

export async function supprimerClasse(id: string) {
  await verifierAdmin();
  await prisma.classe.delete({ where: { id } });
  revalidatePath("/admin/academique");
}

// ---------- Matières ----------

const MatiereSchema = z.object({
  nom: z.string().min(2),
  code: z.string().min(2),
  coefficient: z.coerce.number().int().min(1).max(10),
});

export async function creerMatiere(input: z.infer<typeof MatiereSchema>) {
  await verifierAdmin();
  const data = MatiereSchema.parse(input);

  const matiere = await prisma.matiere.create({ data });
  revalidatePath("/admin/academique");
  return matiere;
}

export async function supprimerMatiere(id: string) {
  await verifierAdmin();
  await prisma.matiere.delete({ where: { id } });
  revalidatePath("/admin/academique");
}
