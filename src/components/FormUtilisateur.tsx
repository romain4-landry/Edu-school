"use client";

import { useState, useTransition } from "react";
import { creerUtilisateur } from "@/app/actions/utilisateurActions";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "ENSEIGNANT", label: "Enseignant" },
  { value: "PARENT", label: "Parent" },
  { value: "CHARGE_ORIENTATION", label: "Chargé d'orientation" },
  { value: "ADMIN", label: "Administrateur" },
];

export default function FormUtilisateur() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  return (
    <form
      className="card-glass space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setErreur(null);
        setSucces(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          try {
            const email = String(formData.get("email"));
            const motDePasse = String(formData.get("motDePasse"));
            await creerUtilisateur({
              nom: String(formData.get("nom")),
              prenom: String(formData.get("prenom")),
              email,
              motDePasse,
              role: String(formData.get("role")) as any,
            });
            (e.target as HTMLFormElement).reset();
            setSucces(`Compte créé : ${email}`);
            router.refresh();
          } catch (err) {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          }
        });
      }}
    >
      <h3 className="font-semibold text-white/90">Nouveau compte</h3>
      <div className="flex gap-2">
        <input name="prenom" placeholder="Prénom" required className="input-dark" />
        <input name="nom" placeholder="Nom" required className="input-dark" />
      </div>
      <input name="email" type="email" placeholder="Email" required className="input-dark" />
      <input
        name="motDePasse"
        type="text"
        placeholder="Mot de passe temporaire (min. 8 caractères)"
        required
        minLength={8}
        className="input-dark"
      />
      <select name="role" required defaultValue="" className="input-dark">
        <option value="" disabled>
          Sélectionner un rôle
        </option>
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {erreur && <p className="text-sm text-red-400">{erreur}</p>}
      {succes && <p className="text-sm text-accent">{succes}</p>}
      <button type="submit" disabled={isPending} className="btn-accent disabled:opacity-50">
        {isPending ? "Création..." : "Créer le compte"}
      </button>
    </form>
  );
}
