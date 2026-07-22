import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormDecisionOrientation from "@/components/FormDecisionOrientation";

export default async function OrientationEleveDetailPage({ params }: { params: { id: string } }) {
  const eleve = await prisma.eleve.findUnique({
    where: { id: params.id },
    include: {
      classe: true,
      notes: { include: { affectation: { include: { matiere: true } } } },
      decisions: {
        include: { charge: true, commentaires: true },
        orderBy: { dateEmission: "desc" },
      },
    },
  });

  if (!eleve) notFound();

  const moyenneGenerale =
    eleve.notes.length > 0
      ? eleve.notes.reduce((sum, n) => sum + Number(n.valeur), 0) / eleve.notes.length
      : null;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold">
        <span className="text-gradient">{eleve.prenom} {eleve.nom}</span>
      </h1>
      <p className="mt-1 text-white/60">
        {eleve.classe.nom} — #{eleve.matricule}
        {moyenneGenerale !== null && ` — Moyenne générale : ${moyenneGenerale.toFixed(2)}/20`}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="card-glass p-5">
          <h3 className="mb-3 font-semibold">Nouvelle décision d'orientation</h3>
          <FormDecisionOrientation eleveId={eleve.id} />
        </section>

        <section className="space-y-4">
          {eleve.decisions.length === 0 && (
            <p className="text-sm text-white/50">Aucune décision émise pour l'instant.</p>
          )}
          {eleve.decisions.map((d) => (
            <div key={d.id} className="card-glass p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-accent">{d.filiereProposee}</p>
                <span className="text-xs text-white/40">
                  {new Date(d.dateEmission).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">{d.justification}</p>
              <p className="mt-2 text-xs text-white/40">
                Par {d.charge.prenom} {d.charge.nom}
              </p>

              {d.commentaires.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  {d.commentaires.map((c) => (
                    <p key={c.id} className="text-sm text-white/60">
                      💬 {c.contenu}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
