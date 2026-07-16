"use client";

import { useState, useTransition } from "react";
import { creerEtablissement } from "@/app/actions/academiqueActions";
import { useRouter } from "next/navigation";

export default function FormEtablissement() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  return (
    <form
      className="card-glass space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            await creerEtablissement({
              nom: String(formData.get("nom")),
              ville: String(formData.get("ville")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvel établissement</h3>
      <input name="nom" placeholder="Nom de l'établissement" required className="input-dark" />
      <input name="ville" placeholder="Ville" required className="input-dark" />
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
