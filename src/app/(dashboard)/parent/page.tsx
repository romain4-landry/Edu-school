import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ParentPage() {
  const session = await getServerSession(authOptions);

  const enfants = await prisma.eleve.findMany({
    where: { parentId: session!.user.id },
    include: { classe: true },
    orderBy: { nom: "asc" },
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        Espace <span className="text-gradient">Parent</span>
      </h1>
      <p className="mt-1 text-white/60">
        Bonjour {session?.user?.name}, voici vos enfants.
      </p>

      <div className="mt-8 card-glass divide-y divide-white/10">
        {enfants.length === 0 && (
          <p className="p-4 text-sm text-white/50">
            Aucun enfant n'est encore rattaché à votre compte.
          </p>
        )}
        {enfants.map((e) => (
          <Link
            key={e.id}
            href={`/parent/eleve/${e.id}`}
            className="flex items-center justify-between p-4 transition hover:bg-white/5"
          >
            <div>
              <p className="font-medium">
                {e.prenom} {e.nom}
              </p>
              <p className="text-sm text-white/50">
                {e.classe.nom} — #{e.matricule}
              </p>
            </div>
            <span className="text-accent">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
