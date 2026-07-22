import { prisma } from "@/lib/prisma";
import FormUtilisateur from "@/components/FormUtilisateur";
import BoutonToggleActif from "@/components/BoutonToggleActif";

const LABELS_ROLE: Record<string, string> = {
  ADMIN: "Administrateur",
  ENSEIGNANT: "Enseignant",
  PARENT: "Parent",
  CHARGE_ORIENTATION: "Chargé d'orientation",
};

export default async function UtilisateursPage() {
  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { creeLe: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold">
        Gestion des <span className="text-gradient">utilisateurs</span>
      </h1>
      <p className="mt-1 text-white/60">
        Comptes enseignants, parents et chargés d'orientation.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FormUtilisateur />
        </div>

        <div className="card-glass divide-y divide-white/10 lg:col-span-2">
          {utilisateurs.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {u.prenom} {u.nom}{" "}
                  {!u.actif && (
                    <span className="ml-2 rounded bg-red-400/10 px-2 py-0.5 text-xs text-red-400">
                      Désactivé
                    </span>
                  )}
                </p>
                <p className="text-sm text-white/50">
                  {u.email} — {LABELS_ROLE[u.role]}
                </p>
              </div>
              <BoutonToggleActif id={u.id} actif={u.actif} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
