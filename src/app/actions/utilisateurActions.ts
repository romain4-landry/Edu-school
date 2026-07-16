"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

async function verifierAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Accès refusé : rôle administrateur requis.");
  }
  return session;
}

const UtilisateurSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  motDePasse: z.string().min(8),
  role: z.enum(["ADMIN", "ENSEIGNANT", "PARENT", "CHARGE_ORIENTATION"]),
});

export async function creerUtilisateur(input: z.infer<typeof UtilisateurSchema>) {
  await verifierAdmin();
  const data = UtilisateurSchema.parse(input);

  const existant = await prisma.utilisateur.findUnique({ where: { email: data.email } });
  if (existant) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const motDePasseHash = await bcrypt.hash(data.motDePasse, 10);

  const utilisateur = await prisma.utilisateur.create({
    data: {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasseHash,
      role: data.role,
    },
  });

  revalidatePath("/admin/utilisateurs");
  return utilisateur;
}

export async function desactiverUtilisateur(id: string) {
  await verifierAdmin();
  await prisma.utilisateur.update({
    where: { id },
    data: { actif: false },
  });
  revalidatePath("/admin/utilisateurs");
}

export async function reactiverUtilisateur(id: string) {
  await verifierAdmin();
  await prisma.utilisateur.update({
    where: { id },
    data: { actif: true },
  });
  revalidatePath("/admin/utilisateurs");
}
