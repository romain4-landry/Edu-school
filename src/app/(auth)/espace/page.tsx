import Link from "next/link";

const ESPACES = [
  {
    role: "ADMIN",
    titre: "Administrateur",
    description: "Gestion des établissements, classes, utilisateurs et affectations.",
  },
  {
    role: "ENSEIGNANT",
    titre: "Enseignant",
    description: "Saisie des notes pour vos classes et matières.",
  },
  {
    role: "PARENT",
    titre: "Parent",
    description: "Suivi des notes et des décisions d'orientation de votre enfant.",
  },
  {
    role: "CHARGE_ORIENTATION",
    titre: "Chargé d'orientation",
    description: "Analyse des profils et émission des décisions d'orientation.",
  },
];

export default function EspacePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-2xl font-bold md:text-3xl">
          Quel est votre <span className="text-gradient">espace</span> ?
        </h1>
        <p className="mt-2 text-white/60">
          Sélectionnez votre profil pour accéder à votre tableau de bord.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {ESPACES.map((e) => (
            <Link
              key={e.role}
              href={`/login?role=${e.role}`}
              className="card-glass p-6 text-left transition hover:border-accent/40"
            >
              <h3 className="font-semibold text-accent">{e.titre}</h3>
              <p className="mt-2 text-sm text-white/60">{e.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
