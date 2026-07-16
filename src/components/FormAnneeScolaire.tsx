"use client";

import { useState, useTransition } from "react";
import { creerAnneeScolaire } from "@/app/actions/academiqueActions";
import { useRouter } from "next/navigation";

export default function FormAnneeScolaire() {
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
            await creerAnneeScolaire({
              libelle: String(formData.get("libelle")),
              dateDebut: String(formData.get("dateDebut")),
              dateFin: String(formData.get("dateFin")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvelle année scolaire</h3>
      <input name="libelle" placeholder="ex: 2026-2027" required className="input-dark" />
      <div className="flex gap-2">
        <input name="dateDebut" type="date" required className="input-dark" />
        <input name="dateFin" type="date" required className="input-dark" />
      </div>
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
