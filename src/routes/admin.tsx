import { AdminPanel } from "@/components/AdminPanel";
import { Link } from "@tanstack/react-router";

export default function Admin() {
  return (
    <main className="min-h-screen bg-sun text-ink overflow-x-hidden grain">
      <header className="fixed top-0 inset-x-0 z-50 bg-sun/90 backdrop-blur border-b-2 border-ink">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-2xl tracking-tight">
            TOGETHER<span className="text-ocean">.</span>PIRIPIRI <span className="text-sm bg-ink text-sun px-2 ml-2">ADMIN</span>
          </Link>
          <Link to="/" className="btn-stamp px-4 py-2 text-sm md:text-base">SAIR</Link>
        </div>
      </header>

      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <AdminPanel />
      </section>

      <footer className="bg-ink text-cream py-12 px-6 border-t-4 border-sun">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-display text-3xl mb-2">TOGETHER<span className="text-ocean">.</span>PIRIPIRI</div>
          <p className="text-sm text-cream/70">
            Painel de Controle Administrativo
          </p>
        </div>
      </footer>
    </main>
  );
}
