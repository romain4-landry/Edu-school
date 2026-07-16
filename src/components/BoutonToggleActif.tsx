"use client";

import { useTransition } from "react";
import { desactiverUtilisateur, reactiverUtilisateur } from "@/app/actions/utilisateurActions";
import { useRouter } from "next/navigation";

export default function BoutonToggleActif({ id, actif }: { id: string; actif: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          if (actif) {
            await desactiverUtilisateur(id);
          } else {
            await reactiverUtilisateur(id);
          }
          router.refresh();
        });
      }}
      className={`rounded-md px-3 py-1 text-xs font-medium transition ${
        actif
          ? "border border-red-400/40 text-red-400 hover:bg-red-400/10"
          : "border border-accent/40 text-accent hover:bg-accent/10"
      }`}
    >
      {isPending ? "..." : actif ? "Désactiver" : "Réactiver"}
    </button>
  );
}
