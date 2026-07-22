import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrientationPage() {
  const eleves = await prisma.eleve.findMany({
    include: { classe: true, decisions: true },
    orderBy: { nom: "asc" },
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        Espace <span className="text-gradient">Orientation</span>
      </h1>
      <p className="mt-1 text-white/60">{eleves.length} élève(s) à orienter.</p>

      <div className="mt-8 card-glass divide-y divide-white/10">
        {eleves.length === 0 && (
          <p className="p-4 text-sm text-white/50">Aucun élève enregistré pour l'instant.</p>
        )}
        {eleves.map((e) => (
          <Link
            key={e.id}
            href={`/orientation/eleve/${e.id}`}
            className="flex items-center justify-between p-4 transition hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{e.prenom} {e.nom}</p>
              <p className="text-sm text-white/50">{e.classe.nom} — #{e.matricule}</p>
            </div>
            <span className="text-sm text-white/50">
              {e.decisions.length} décision(s) →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
