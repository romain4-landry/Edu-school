import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EnseignantPage() {
  const session = await getServerSession(authOptions);

  const affectations = await prisma.affectation.findMany({
    where: { enseignantId: session!.user.id },
    include: { matiere: true, classe: true, anneeScolaire: true },
    orderBy: { id: "desc" },
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        Espace <span className="text-gradient">Enseignant</span>
      </h1>
      <p className="mt-1 text-white/60">
        Bonjour {session?.user?.name}, voici vos classes.
      </p>

      <div className="mt-8 card-glass divide-y divide-white/10">
        {affectations.length === 0 && (
          <p className="p-4 text-sm text-white/50">
            Aucune affectation ne vous a encore été attribuée par l'administration.
          </p>
        )}
        {affectations.map((a) => (
          <Link
            key={a.id}
            href={`/enseignant/affectation/${a.id}`}
            className="flex items-center justify-between p-4 transition hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{a.matiere.nom}</p>
              <p className="text-sm text-white/50">
                {a.classe.nom} — {a.anneeScolaire.libelle}
              </p>
            </div>
            <span className="text-accent">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
