"use client";

import { useState, useTransition } from "react";
import { creerEleve } from "@/app/actions/eleveActions";
import { useRouter } from "next/navigation";

type Props = {
  classes: { id: string; nom: string; niveau: string }[];
  parents: { id: string; nom: string; prenom: string; email: string }[];
};

export default function FormEleve({ classes, parents }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  if (classes.length === 0) {
    return (
      <div className="card-glass p-5 text-sm text-white/50">
        Crée d'abord une classe (Gestion académique) avant d'ajouter un élève.
      </div>
    );
  }

  if (parents.length === 0) {
    return (
      <div className="card-glass p-5 text-sm text-white/50">
        Crée d'abord un compte parent (Gestion des utilisateurs) avant d'ajouter un élève.
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
            await creerEleve({
              matricule: String(formData.get("matricule")),
              nom: String(formData.get("nom")),
              prenom: String(formData.get("prenom")),
              dateNaissance: String(formData.get("dateNaissance")),
              classeId: String(formData.get("classeId")),
              parentId: String(formData.get("parentId")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvel élève</h3>
      <input name="matricule" placeholder="Matricule (unique)" required className="input-dark" />
      <div className="flex gap-2">
        <input name="prenom" placeholder="Prénom" required className="input-dark" />
        <input name="nom" placeholder="Nom" required className="input-dark" />
      </div>
      <input name="dateNaissance" type="date" required className="input-dark" />
      <select name="classeId" required defaultValue="" className="input-dark">
        <option value="" disabled>
          Sélectionner une classe
        </option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom} ({c.niveau})
          </option>
        ))}
      </select>
      <select name="parentId" required defaultValue="" className="input-dark">
        <option value="" disabled>
          Sélectionner un parent
        </option>
        {parents.map((p) => (
          <option key={p.id} value={p.id}>
            {p.prenom} {p.nom} — {p.email}
          </option>
        ))}
      </select>
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer l'élève"}
      </button>
    </form>
  );
}
