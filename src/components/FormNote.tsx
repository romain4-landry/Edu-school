"use client";

import { useState, useTransition } from "react";
import { saisirNote } from "@/app/actions/noteActions";
import { useRouter } from "next/navigation";

const SEQUENCES = ["S1", "S2", "S3", "S4", "S5", "S6"];

export default function FormNote({ eleveId, affectationId }: { eleveId: string; affectationId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            await saisirNote({
              eleveId,
              affectationId,
              valeur: String(formData.get("valeur")) as any,
              sequence: String(formData.get("sequence")) as any,
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <select name="sequence" required defaultValue="" className="input-dark w-28">
        <option value="" disabled>Séq.</option>
        {SEQUENCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        name="valeur"
        type="number"
        min={0}
        max={20}
        step="0.25"
        placeholder="Note /20"
        required
        className="input-dark w-28"
      />
      <button type="submit" disabled={isPending} className="btn-accent">
        {isPending ? "..." : "Enregistrer"}
      </button>
      {erreur && <p className="w-full text-sm text-red-400">{erreur}</p>}
    </form>
  );
}
