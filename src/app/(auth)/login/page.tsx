"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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

    setChargement(false);

    if (res?.error) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <form
        onSubmit={handleSubmit}
        className="card-glass w-full max-w-sm space-y-4 p-8"
      >
        <h1 className="text-xl font-bold">
          Connexion — <span className="text-gradient">EDU SCHOOL</span>
        </h1>

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
      </form>
    </main>
  );
}
