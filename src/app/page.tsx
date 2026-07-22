import Link from "next/link";

const ACTEURS = [
  {
    role: "Enseignant",
    description: "Saisit les notes par séquence, matière et classe, en toute sécurité.",
  },
  {
    role: "Parent",
    description: "Suit en temps réel les résultats de son enfant et reçoit une notification à chaque nouvelle note.",
  },
  {
    role: "Chargé d'orientation",
    description: "Analyse le profil scolaire et propose une filière argumentée, adaptée au système éducatif camerounais.",
  },
  {
    role: "Administrateur",
    description: "Pilote les établissements, classes, matières et comptes de tout le système.",
  },
];

const ETAPES = [
  {
    numero: "01",
    titre: "Suivi académique continu",
    description: "Les notes de chaque séquence sont centralisées, matière par matière, du S1 au S6.",
  },
  {
    numero: "02",
    titre: "Analyse du profil de l'élève",
    description: "Moyennes par matière, tendances, points forts — une vision claire pour guider la décision.",
  },
  {
    numero: "03",
    titre: "Décision d'orientation argumentée",
    description: "Le chargé d'orientation propose une filière (Scientifique, Littéraire, Technique...) avec justification.",
  },
  {
    numero: "04",
    titre: "Implication du parent",
    description: "Le parent est notifié par email, consulte la décision et peut réagir directement depuis son espace.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-white">
      {/* Navbar publique */}
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-bold">
            EDU <span className="text-gradient">SCHOOL</span>
          </span>
          <Link href="/espace" className="btn-accent">
            Se connecter
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          ORIENTATION SCOLAIRE — ENSEIGNEMENT SECONDAIRE CAMEROUNAIS
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          L'orientation de votre enfant,{" "}
          <span className="text-gradient">enfin guidée par les données</span>
        </h1>

        <p className="mt-5 max-w-xl text-white/60">
          EDU SCHOOL centralise le suivi académique des élèves camerounais du
          secondaire et transforme les résultats scolaires en décisions
          d'orientation claires, argumentées et partagées avec les familles.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/espace" className="btn-accent">
            Accéder à mon espace →
          </Link>
          <a href="#fonctionnement" className="btn-outline">
            Comment ça marche
          </a>
        </div>

        {/* Stats façon Zaro Tech */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-gradient">4</p>
            <p className="mt-1 text-sm text-white/50">Acteurs connectés</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gradient">6</p>
            <p className="mt-1 text-sm text-white/50">Séquences suivies /an</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gradient">100%</p>
            <p className="mt-1 text-sm text-white/50">Décisions argumentées</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gradient">Temps réel</p>
            <p className="mt-1 text-sm text-white/50">Notification des parents</p>
          </div>
        </div>
      </section>

      {/* Pourquoi l'orientation est un enjeu au Cameroun */}
      <section className="border-t border-white/10 bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">
            Pourquoi l'orientation <span className="text-gradient">change tout</span>
          </h2>
          <p className="mt-4 max-w-2xl text-white/60">
            Au Cameroun, le passage vers les filières générales, techniques ou
            professionnelles du secondaire détermine souvent toute la suite du
            parcours de l'élève. Une orientation mal informée, faite sans
            historique de notes ni analyse claire, coûte des années aux
            familles. EDU SCHOOL donne aux établissements les moyens de fonder
            chaque décision sur des données réelles, suivies dans la durée.
          </p>
        </div>
      </section>

      {/* Les 4 acteurs */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">
            Un espace pour <span className="text-gradient">chaque acteur</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACTEURS.map((a) => (
              <div key={a.role} className="card-glass p-5">
                <h3 className="font-semibold text-accent">{a.role}</h3>
                <p className="mt-2 text-sm text-white/60">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="border-t border-white/10 bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">
            Comment <span className="text-gradient">ça marche</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {ETAPES.map((e) => (
              <div key={e.numero} className="card-glass flex gap-4 p-5">
                <span className="text-2xl font-bold text-accent/40">{e.numero}</span>
                <div>
                  <h3 className="font-semibold">{e.titre}</h3>
                  <p className="mt-1 text-sm text-white/60">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Prêt à suivre l'orientation de vos élèves ?
          </h2>
          <p className="mt-3 text-white/60">
            Connectez-vous à votre espace pour accéder au tableau de bord
            adapté à votre rôle.
          </p>
          <Link href="/espace" className="btn-accent mt-6 inline-block">
            Se connecter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-white/40">
          EDU SCHOOL — Système d'orientation scolaire, enseignement secondaire, Cameroun.
        </div>
      </footer>
    </main>
  );
}
