"use client";

import { useState, useTransition } from "react";
import { creerClasse } from "@/app/actions/academiqueActions";
import { useRouter } from "next/navigation";

type Props = {
  etablissements: { id: string; nom: string }[];
};

export default function FormClasse({ etablissements }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  if (etablissements.length === 0) {
    return (
      <div className="card-glass p-5 text-sm text-white/50">
        Crée d'abord un établissement avant d'ajouter une classe.
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
            await creerClasse({
              nom: String(formData.get("nom")),
              niveau: String(formData.get("niveau")),
              etablissementId: String(formData.get("etablissementId")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvelle classe</h3>
      <input name="nom" placeholder="ex: 3e A" required className="input-dark" />
      <input name="niveau" placeholder="ex: 3e" required className="input-dark" />
      <select name="etablissementId" required className="input-dark">
        <option value="">Sélectionner un établissement</option>
        {etablissements.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nom}
          </option>
        ))}
      </select>
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
