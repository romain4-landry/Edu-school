"use client";

import { useState, useTransition } from "react";
import { creerAffectation } from "@/app/actions/affectationActions";
import { useRouter } from "next/navigation";

type Props = {
  enseignants: { id: string; nom: string; prenom: string }[];
  matieres: { id: string; nom: string }[];
  classes: { id: string; nom: string }[];
  anneesScolaires: { id: string; libelle: string }[];
};

export default function FormAffectation({ enseignants, matieres, classes, anneesScolaires }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  const manque =
    enseignants.length === 0 ||
    matieres.length === 0 ||
    classes.length === 0 ||
    anneesScolaires.length === 0;

  if (manque) {
    return (
      <div className="card-glass p-5 text-sm text-white/50">
        Il faut au moins un enseignant, une matière, une classe et une année scolaire avant de créer une affectation.
      </div>
    );
  }

  return (
    <form
      className="card-glass space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            await creerAffectation({
              enseignantId: String(formData.get("enseignantId")),
              matiereId: String(formData.get("matiereId")),
              classeId: String(formData.get("classeId")),
              anneeScolaireId: String(formData.get("anneeScolaireId")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvelle affectation</h3>

      <select name="enseignantId" required defaultValue="" className="input-dark">
        <option value="" disabled>Sélectionner un enseignant</option>
        {enseignants.map((e) => (
          <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
        ))}
      </select>

      <select name="matiereId" required defaultValue="" className="input-dark">
        <option value="" disabled>Sélectionner une matière</option>
        {matieres.map((m) => (
          <option key={m.id} value={m.id}>{m.nom}</option>
        ))}
      </select>

      <select name="classeId" required defaultValue="" className="input-dark">
        <option value="" disabled>Sélectionner une classe</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>

      <select name="anneeScolaireId" required defaultValue="" className="input-dark">
        <option value="" disabled>Sélectionner une année scolaire</option>
        {anneesScolaires.map((a) => (
          <option key={a.id} value={a.id}>{a.libelle}</option>
        ))}
      </select>

      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer l'affectation"}
      </button>
    </form>
  );
}
