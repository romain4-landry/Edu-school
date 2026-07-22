import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FormCommentaire from "@/components/FormCommentaire";

export default async function EleveDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const eleve = await prisma.eleve.findUnique({
    where: { id: params.id },
    include: { classe: true },
  });

  if (!eleve) notFound();
  if (eleve.parentId !== session!.user.id) redirect("/acces-refuse");

  const [notes, decisions] = await Promise.all([
    prisma.note.findMany({
      where: { eleveId: eleve.id },
      include: { affectation: { include: { matiere: true } } },
      orderBy: [{ affectation: { matiere: { nom: "asc" } } }, { sequence: "asc" }],
    }),
    prisma.decisionOrientation.findMany({
      where: { eleveId: eleve.id },
      include: { charge: true, commentaires: true },
      orderBy: { dateEmission: "desc" },
    }),
  ]);

  const parMatiere = notes.reduce<Record<string, typeof notes>>((acc, note) => {
    const nomMatiere = note.affectation.matiere.nom;
    if (!acc[nomMatiere]) acc[nomMatiere] = [];
    acc[nomMatiere].push(note);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        <span className="text-gradient">{eleve.prenom} {eleve.nom}</span>
      </h1>
      <p className="mt-1 text-white/60">
        {eleve.classe.nom} — Matricule #{eleve.matricule}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="font-semibold text-white/90">Notes</h2>
          {Object.keys(parMatiere).length === 0 && (
            <p className="text-sm text-white/50">Aucune note enregistrée pour l'instant.</p>
          )}
          {Object.entries(parMatiere).map(([matiere, notesMatiere]) => {
            const moyenne =
              notesMatiere.reduce((sum, n) => sum + Number(n.valeur), 0) / notesMatiere.length;
            return (
              <div key={matiere} className="card-glass p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{matiere}</h3>
                  <span className="rounded-md bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                    Moy. {moyenne.toFixed(2)}/20
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {notesMatiere.map((n) => (
                    <span key={n.id} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                      {n.sequence} : {Number(n.valeur)}/20
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-white/90">Orientation</h2>
          {decisions.length === 0 && (
            <p className="text-sm text-white/50">Aucune décision d'orientation pour l'instant.</p>
          )}
          {decisions.map((d) => (
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
                    <p key={c.id} className="text-sm text-white/60">💬 {c.contenu}</p>
                  ))}
                </div>
              )}

              <FormCommentaire decisionId={d.id} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
