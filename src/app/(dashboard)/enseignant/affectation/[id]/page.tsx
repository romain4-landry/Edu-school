import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import FormNote from "@/components/FormNote";

export default async function AffectationDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const affectation = await prisma.affectation.findUnique({
    where: { id: params.id },
    include: { matiere: true, classe: true, anneeScolaire: true },
  });

  if (!affectation) notFound();
  if (affectation.enseignantId !== session!.user.id) redirect("/acces-refuse");

  const eleves = await prisma.eleve.findMany({
    where: { classeId: affectation.classeId },
    include: {
      notes: {
        where: { affectationId: affectation.id },
        orderBy: { dateSaisie: "desc" },
      },
    },
    orderBy: { nom: "asc" },
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold">
        <span className="text-gradient">{affectation.matiere.nom}</span> — {affectation.classe.nom}
      </h1>
      <p className="mt-1 text-white/60">{affectation.anneeScolaire.libelle}</p>

      <div className="mt-8 space-y-4">
        {eleves.length === 0 && (
          <p className="text-sm text-white/50">Aucun élève dans cette classe pour l'instant.</p>
        )}
        {eleves.map((eleve) => (
          <div key={eleve.id} className="card-glass p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {eleve.prenom} {eleve.nom}{" "}
                <span className="text-sm text-white/40">#{eleve.matricule}</span>
              </p>
            </div>

            {eleve.notes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {eleve.notes.map((n) => (
                  <span
                    key={n.id}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
                  >
                    {n.sequence} : {n.valeur.toString()}/20
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3">
              <FormNote eleveId={eleve.id} affectationId={affectation.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
