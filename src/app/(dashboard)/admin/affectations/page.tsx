import { prisma } from "@/lib/prisma";
import FormAffectation from "@/components/FormAffectation";

export default async function AffectationsPage() {
  const [affectations, enseignants, matieres, classes, anneesScolaires] = await Promise.all([
    prisma.affectation.findMany({
      include: { enseignant: true, matiere: true, classe: true, anneeScolaire: true },
      orderBy: { id: "desc" },
    }),
    prisma.utilisateur.findMany({ where: { role: "ENSEIGNANT", actif: true }, orderBy: { nom: "asc" } }),
    prisma.matiere.findMany({ orderBy: { nom: "asc" } }),
    prisma.classe.findMany({ orderBy: { nom: "asc" } }),
    prisma.anneeScolaire.findMany({ orderBy: { dateDebut: "desc" } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold">
        Gestion des <span className="text-gradient">affectations</span>
      </h1>
      <p className="mt-1 text-white/60">Qui enseigne quoi, dans quelle classe, quelle année.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FormAffectation
            enseignants={enseignants}
            matieres={matieres}
            classes={classes}
            anneesScolaires={anneesScolaires}
          />
        </div>

        <div className="card-glass divide-y divide-white/10 lg:col-span-2">
          {affectations.length === 0 && (
            <p className="p-4 text-sm text-white/50">Aucune affectation pour l'instant.</p>
          )}
          {affectations.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {a.enseignant.prenom} {a.enseignant.nom} → {a.matiere.nom}
                </p>
                <p className="text-sm text-white/50">
                  {a.classe.nom} — {a.anneeScolaire.libelle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
