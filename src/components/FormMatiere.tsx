"use client";

import { useState, useTransition } from "react";
import { creerMatiere } from "@/app/actions/academiqueActions";
import { useRouter } from "next/navigation";

export default function FormMatiere() {
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
            await creerMatiere({
              nom: String(formData.get("nom")),
              code: String(formData.get("code")),
              coefficient: String(formData.get("coefficient")),
            } as any);
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouvelle matière</h3>
      <input name="nom" placeholder="ex: Mathématiques" required className="input-dark" />
      <div className="flex gap-2">
        <input name="code" placeholder="Code (ex: MATH)" required className="input-dark" />
        <input
          name="coefficient"
          type="number"
          min={1}
          max={10}
          placeholder="Coef."
          required
          className="input-dark"
        />
      </div>
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
