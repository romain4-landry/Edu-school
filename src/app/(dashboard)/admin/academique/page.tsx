import { prisma } from "@/lib/prisma";
import FormEtablissement from "@/components/FormEtablissement";
import FormAnneeScolaire from "@/components/FormAnneeScolaire";
import FormClasse from "@/components/FormClasse";
import FormMatiere from "@/components/FormMatiere";

export default async function AcademiquePage() {
  const [etablissements, anneesScolaires, classes, matieres] = await Promise.all([
    prisma.etablissement.findMany({ orderBy: { nom: "asc" } }),
    prisma.anneeScolaire.findMany({ orderBy: { dateDebut: "desc" } }),
    prisma.classe.findMany({
      orderBy: { nom: "asc" },
      include: { etablissement: true },
    }),
    prisma.matiere.findMany({ orderBy: { nom: "asc" } }),
  ]);

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        Gestion <span className="text-gradient">académique</span>
      </h1>
      <p className="mt-1 text-white/60">
        Établissements, années scolaires, classes et matières.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <FormEtablissement />
          <div className="card-glass divide-y divide-white/10">
            {etablissements.length === 0 && (
              <p className="p-4 text-sm text-white/50">Aucun établissement pour l'instant.</p>
            )}
            {etablissements.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{e.nom}</p>
                  <p className="text-sm text-white/50">{e.ville}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <FormAnneeScolaire />
          <div className="card-glass divide-y divide-white/10">
            {anneesScolaires.length === 0 && (
              <p className="p-4 text-sm text-white/50">Aucune année scolaire pour l'instant.</p>
            )}
            {anneesScolaires.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <p className="font-medium">{a.libelle}</p>
                <p className="text-sm text-white/50">
                  {new Date(a.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                  {new Date(a.dateFin).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <FormClasse etablissements={etablissements} />
          <div className="card-glass divide-y divide-white/10">
            {classes.length === 0 && (
              <p className="p-4 text-sm text-white/50">Aucune classe pour l'instant.</p>
            )}
            {classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{c.nom}</p>
                  <p className="text-sm text-white/50">
                    {c.niveau} — {c.etablissement.nom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <FormMatiere />
          <div className="card-glass divide-y divide-white/10">
            {matieres.length === 0 && (
              <p className="p-4 text-sm text-white/50">Aucune matière pour l'instant.</p>
            )}
            {matieres.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4">
                <p className="font-medium">{m.nom}</p>
                <p className="text-sm text-white/50">
                  {m.code} — coef. {m.coefficient}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
