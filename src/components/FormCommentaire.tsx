"use client";

import { useState, useTransition } from "react";
import { commenterDecision } from "@/app/actions/orientationActions";
import { useRouter } from "next/navigation";

export default function FormCommentaire({ decisionId }: { decisionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  return (
    <form
      className="mt-3 flex gap-2 border-t border-white/10 pt-3"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            await commenterDecision({
              decisionId,
              contenu: String(formData.get("contenu")),
            });
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <input
        name="contenu"
        placeholder="Votre commentaire..."
        required
        className="input-dark flex-1"
      />
      <button type="submit" disabled={isPending} className="btn-accent">
        {isPending ? "..." : "Envoyer"}
      </button>
      {erreur && <p className="w-full text-sm text-red-400">{erreur}</p>}
    </form>
  );
}
