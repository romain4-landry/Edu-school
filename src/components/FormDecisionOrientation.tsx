"use client";

import { useState, useTransition } from "react";
import { emettreDecisionOrientation } from "@/app/actions/orientationActions";
import { useRouter } from "next/navigation";

export default function FormDecisionOrientation({ eleveId }: { eleveId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        setSucces(false);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            await emettreDecisionOrientation({
              eleveId,
              filiereProposee: String(formData.get("filiereProposee")),
              justification: String(formData.get("justification")),
            });
            (e.target as HTMLFormElement).reset();
            setSucces(true);
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <input
        name="filiereProposee"
        placeholder="Filière proposée (ex: Scientifique C)"
        required
        className="input-dark"
      />
      <textarea
        name="justification"
        placeholder="Justification argumentée (min. 10 caractères)"
        required
        minLength={10}
        rows={3}
        className="input-dark"
      />
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      {succes && <p className="text-sm text-accent">Décision émise et parent notifié.</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Envoi..." : "Émettre la décision"}
      </button>
    </form>
  );
}
