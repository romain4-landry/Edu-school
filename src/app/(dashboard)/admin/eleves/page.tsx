import { prisma } from "@/lib/prisma";
import FormEleve from "@/components/FormEleve";

export default async function ElevesPage() {
  const [eleves, classes, parents] = await Promise.all([
    prisma.eleve.findMany({
      orderBy: { nom: "asc" },
      include: { classe: true, parent: true },
    }),
    prisma.classe.findMany({ orderBy: { nom: "asc" } }),
    prisma.utilisateur.findMany({
      where: { role: "PARENT", actif: true },
      orderBy: { nom: "asc" },
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold">
        Gestion des <span className="text-gradient">élèves</span>
      </h1>
      <p className="mt-1 text-white/60">{eleves.length} élève(s) enregistré(s).</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FormEleve classes={classes} parents={parents} />
        </div>

        <div className="card-glass divide-y divide-white/10 lg:col-span-2">
          {eleves.length === 0 && (
            <p className="p-4 text-sm text-white/50">Aucun élève pour l'instant.</p>
          )}
          {eleves.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {e.prenom} {e.nom}{" "}
                  <span className="text-sm text-white/40">#{e.matricule}</span>
                </p>
                <p className="text-sm text-white/50">
                  {e.classe.nom} — Parent : {e.parent.prenom} {e.parent.nom}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
