export default function AccesRefusePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Accès refusé</h1>
      <p className="text-gray-600">
        Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <a href="/" className="text-blue-600 underline">
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
