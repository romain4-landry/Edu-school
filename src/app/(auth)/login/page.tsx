"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const REDIRECTION_PAR_ROLE: Record<string, string> = {
  ADMIN: "/admin",
  ENSEIGNANT: "/enseignant",
  PARENT: "/parent",
  CHARGE_ORIENTATION: "/orientation",
};

const LABELS_ROLE: Record<string, string> = {
  ADMIN: "Administrateur",
  ENSEIGNANT: "Enseignant",
  PARENT: "Parent",
  CHARGE_ORIENTATION: "Chargé d'orientation",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleChoisi = searchParams.get("role");

  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setChargement(false);
      setErreur("Email ou mot de passe incorrect.");
      return;
    }

    const session = await getSession();
    const roleReel = session?.user?.role ?? "";

    if (roleChoisi && roleReel !== roleChoisi) {
      setChargement(false);
      setErreur(
        `Ce compte correspond à l'espace "${LABELS_ROLE[roleReel] ?? roleReel}", pas à "${LABELS_ROLE[roleChoisi] ?? roleChoisi}".`
      );
      return;
    }

    const destination = REDIRECTION_PAR_ROLE[roleReel] ?? "/";
    router.push(destination);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <form
        onSubmit={handleSubmit}
        className="card-glass w-full max-w-sm space-y-4 p-8"
      >
        <div>
          <h1 className="text-xl font-bold">
            Connexion — <span className="text-gradient">EDU SCHOOL</span>
          </h1>
          {roleChoisi && (
            <p className="mt-1 text-sm text-white/50">
              Espace {LABELS_ROLE[roleChoisi] ?? roleChoisi}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Email</label>
          <input name="email" type="email" required className="input-dark" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Mot de passe</label>
          <input name="password" type="password" required className="input-dark" />
        </div>

        {erreur && <p className="text-sm text-red-400">{erreur}</p>}

        <button type="submit" disabled={chargement} className="btn-accent w-full disabled:opacity-50">
          {chargement ? "Connexion..." : "Se connecter"}
        </button>

        <Link href="/espace" className="block text-center text-sm text-white/40 hover:text-white/60">
          ← Changer d'espace
        </Link>
      </form>
    </main>
  );
}
