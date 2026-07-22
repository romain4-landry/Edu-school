"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS_PAR_ROLE: Record<string, { href: string; label: string }[]> = {
  ADMIN: [
    { href: "/admin", label: "Accueil" },
    { href: "/admin/academique", label: "Académique" },
    { href: "/admin/utilisateurs", label: "Utilisateurs" },
    { href: "/admin/eleves", label: "Élèves" },
    { href: "/admin/affectations", label: "Affectations" },
  ],
  ENSEIGNANT: [{ href: "/enseignant", label: "Mes classes" }],
  PARENT: [{ href: "/parent", label: "Mes enfants" }],
  CHARGE_ORIENTATION: [{ href: "/orientation", label: "Élèves à orienter" }],
};

export default function Navbar({
  role,
  nom,
}: {
  role: string;
  nom: string;
}) {
  const pathname = usePathname();
  const liens = LIENS_PAR_ROLE[role] ?? [];

  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold">
            EDU <span className="text-gradient">SCHOOL</span>
          </Link>
          <div className="flex gap-1">
            {liens.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  pathname === lien.href
                    ? "bg-accent/10 text-accent"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {lien.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">{nom}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white/70 transition hover:border-red-400/40 hover:text-red-400"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
