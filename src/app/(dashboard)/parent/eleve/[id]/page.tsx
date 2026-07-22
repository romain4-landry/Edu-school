import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function EleveDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const eleve = await prisma.eleve.findUnique({
    where: { id: params.id },
    include: { classe: true },
  });

  if (!eleve) notFound();
  if (eleve.parentId !== session!.user.id) redirect("/acces-refuse");

  const notes = await prisma.note.findMany({
    where: { eleveId: eleve.id },
    include: { affectation: { include: { matiere: true } } },
    orderBy: [{ affectation: { matiere: { nom: "asc" } } }, { sequence: "asc" }],
  });

  // Regroupement par matière pour un affichage plus lisible
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

      <div className="mt-8 space-y-4">
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
                  <span
                    key={n.id}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
                  >
                    {n.sequence} : {Number(n.valeur)}/20
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
