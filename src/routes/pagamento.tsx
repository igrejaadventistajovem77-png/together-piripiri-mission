import heroBg from "@/assets/hero-nordeste.jpg";
import { PagamentoBusca } from "@/components/PagamentoBusca";
import { Link } from "@tanstack/react-router";

export default function Pagamento() {
  return (
    <main className="min-h-screen bg-sun text-ink overflow-x-hidden grain">
      <header className="fixed top-0 inset-x-0 z-50 bg-sun/90 backdrop-blur border-b-2 border-ink">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-2xl tracking-tight">
            TOGETHER<span className="text-ocean">.</span>PIRIPIRI
          </Link>
          <Link to="/" className="btn-stamp px-4 py-2 text-sm md:text-base">VOLTAR</Link>
        </div>
      </header>

      <section 
        className="relative pt-32 pb-24 px-6 min-h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255,247,225,0.9), rgba(255,247,225,0.9)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl w-full relative z-10">
          <PagamentoBusca />
        </div>
      </section>

      <footer className="bg-ink text-cream py-12 px-6 border-t-4 border-sun">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-display text-3xl mb-2">TOGETHER<span className="text-ocean">.</span>PIRIPIRI</div>
          <p className="text-sm text-cream/70">
            Distrito Piripiri • Página de Pagamento
          </p>
        </div>
      </footer>
    </main>
  );
}
