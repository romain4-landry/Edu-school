import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMoi123!", 10);

  const admin = await prisma.utilisateur.upsert({
    where: { email: "admin@edu-school.cm" },
    update: {},
    create: {
      nom: "Admin",
      prenom: "Système",
      email: "admin@edu-school.cm",
      motDePasseHash: passwordHash,
      role: Role.ADMIN,
    },
  });

  const etablissement = await prisma.etablissement.create({
    data: {
      nom: "Lycée Bilingue de Référence",
      ville: "Yaoundé",
    },
  });

  const anneeScolaire = await prisma.anneeScolaire.create({
    data: {
      libelle: "2025-2026",
      dateDebut: new Date("2025-09-01"),
      dateFin: new Date("2026-07-15"),
    },
  });

  console.log({
    admin: admin.email,
    etablissement: etablissement.nom,
    anneeScolaire: anneeScolaire.libelle,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
