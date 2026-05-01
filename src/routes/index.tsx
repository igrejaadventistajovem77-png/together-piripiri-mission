import { createFileRoute } from "@tanstack/react-router";
import heroBg from "@/assets/hero-nordeste.jpg";
import { InscricaoForm } from "@/components/InscricaoForm";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-sun text-ink overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-sun/90 backdrop-blur border-b-2 border-ink">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="font-display text-2xl tracking-tight">TOGETHER<span className="text-ocean">.</span>PIRIPIRI</div>
          <nav className="hidden md:flex gap-8 font-display text-lg">
            <a href="#sobre" className="hover:text-ocean transition">SOBRE</a>
            <a href="#valores" className="hover:text-ocean transition">VALORES</a>
            <a href="#app" className="hover:text-ocean transition">APP</a>
            <a href="#inscricao" className="hover:text-ocean transition">INSCRIÇÃO</a>
          </nav>
          <a href="#inscricao" className="btn-stamp px-4 py-2 text-sm md:text-base">INSCREVER-SE</a>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-16 grain"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-sun/40 md:bg-sun/20" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl w-full">
          <div className="sticker text-xs sm:text-sm md:text-base mb-5 sm:mb-6">DISTRITO PIRIPIRI • NOVEMBRO 2026</div>
          <h1 className="text-[22vw] sm:text-[18vw] md:text-[14rem] leading-[0.85] font-display tracking-tighter text-shadow-stamp break-words">
            TOGETHER
          </h1>
          <div className="sticker text-base sm:text-xl md:text-3xl mt-2 md:mt-[-1rem]">
            FEEL THE MISSION • NORDESTE
          </div>
          <p className="mt-8 sm:mt-10 text-base sm:text-lg md:text-2xl max-w-2xl mx-auto font-medium px-2">
            <span className="inline-block bg-ink text-cream px-4 py-2 sm:px-5 sm:py-3 border-2 border-ink shadow-[4px_4px_0_var(--ocean)]">
              4 dias. 96 horas. Mais de 11 mil jovens missionários.
              <br />
              <strong className="text-sun">Vem servir e ser transformado.</strong>
            </span>
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <a href="#inscricao" className="btn-stamp px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-xl w-full sm:w-auto text-center">
              QUERO IR DE PIRIPIRI
            </a>
            <a href="#sobre" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-xl border-2 border-ink bg-cream font-display hover:bg-ocean hover:text-cream transition w-full sm:w-auto text-center">
              SAIBA MAIS
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-ink text-cream py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="sticker mb-6">SOBRE O MOVIMENTO</div>
          <h2 className="text-5xl md:text-7xl mb-8">
            UM MOVIMENTO<br />
            <span className="text-sun">MISSIONÁRIO</span> DE JOVENS.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg">
            <p>
              O TOGETHER • FEEL THE MISSION nasceu em 2019 em Brasília. Em novembro de 2026 chega ao
              Nordeste com o mesmo propósito: conectar jovens dispostos a servir com causas reais,
              urgentes e transformadoras.
            </p>
            <p>
              Acontecerá na <strong className="text-sun">Arena Pernambuco</strong> e simultaneamente em
              <strong className="text-sun"> 8 polos</strong> distribuídos por 6 estados do Nordeste,
              mobilizando milhares de voluntários em uma única grande missão.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              ["4", "DIAS DE MISSÃO"],
              ["96h", "DE IMERSÃO"],
              ["11k+", "JOVENS"],
              ["8", "POLOS NO NE"],
            ].map(([n, l]) => (
              <div key={l} className="text-center border-2 border-sun p-6">
                <div className="font-display text-5xl md:text-6xl text-sun">{n}</div>
                <div className="text-sm mt-2 tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUEM PODE PARTICIPAR */}
      <section className="bg-cream py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="sticker mb-6">QUEM PODE PARTICIPAR</div>
          <h2 className="text-5xl md:text-6xl mb-10">
            JOVENS DE <span className="bg-sun px-3">16 A 30 ANOS</span> —<br />E QUEM TIVER MISSÃO NO CORAÇÃO.
          </h2>
          <ul className="space-y-4 text-lg">
            {[
              "Acredita na força da solidariedade.",
              "Deseja viver uma experiência missionária profunda.",
              "Quer transformar vidas — e ser transformado no processo.",
              "15 anos? Pode ir, com responsável.",
              "Acima de 30? Bem-vindo também.",
            ].map((t) => (
              <li key={t} className="flex gap-4 items-start">
                <span className="font-display text-3xl text-ocean leading-none">✦</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VALORES */}
      <section id="valores" className="py-20 md:py-24 px-4 sm:px-6 bg-sun grain">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="sticker mb-6">INVESTIMENTO MISSIONÁRIO</div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl mb-10 md:mb-12">VALORES SIMBÓLICOS.<br />IMPACTO REAL.</h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="stamp-card p-6 sm:p-8">
              <div className="font-display text-sm tracking-widest text-ocean">INSCRIÇÃO</div>
              <div className="font-display text-5xl sm:text-6xl mt-2">R$ 281<span className="text-2xl sm:text-3xl">,90</span></div>
              <p className="mt-4 text-sm">
                Individual, paga pelo <strong>app Together</strong>. Cartão em até <strong>5x sem juros</strong>.
                Diretor jovem pode comprar vouchers em lote.
              </p>
            </div>
            <div className="stamp-card p-6 sm:p-8">
              <div className="font-display text-sm tracking-widest text-ocean">ALIMENTAÇÃO</div>
              <div className="font-display text-5xl sm:text-6xl mt-2">R$ 120<span className="text-2xl sm:text-3xl">,00</span></div>
              <p className="mt-4 text-sm">
                4 dias de alimentação completa. Pago <strong>junto com a inscrição no app</strong>.
                Custo real seria ~R$ 400.
              </p>
            </div>
            <div className="stamp-card p-6 sm:p-8 relative">
              <span className="sticker absolute -top-4 -right-2 sm:-right-4 text-xs">ARENA ↔ POLOS</span>
              <div className="font-display text-sm tracking-widest text-ocean">TRASLADO DO EVENTO</div>
              <div className="font-display text-5xl sm:text-6xl mt-2">R$ 50<span className="text-2xl sm:text-3xl">,00</span></div>
              <p className="mt-4 text-sm">
                Ônibus oficial do evento que leva da <strong>Arena Pernambuco</strong> até os
                <strong> polos de missão</strong> (ida e volta). Pago à organização Together.
              </p>
            </div>
          </div>

          {/* Diferenciação dos dois traslados */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="stamp-card p-6 bg-cream relative">
              <div className="sticker text-xs mb-3">ÔNIBUS DO DISTRITO</div>
              <h3 className="text-2xl sm:text-3xl mb-2">PIRIPIRI ↔ ARENA PERNAMBUCO</h3>
              <p className="text-sm mb-3">
                Ônibus que sai de <strong>Piripiri</strong> levando a galera até a <strong>Arena Pernambuco</strong>
                (sede oficial do evento) e retorna no fim. Organizado pelo Distrito Piripiri.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl">R$ a definir</span>
                <span className="text-xs text-ink/60">• valor a confirmar pela coordenação</span>
              </div>
              <p className="text-xs mt-2">👉 Garanta sua vaga no formulário abaixo. O valor e parcelamento serão informados em breve.</p>
            </div>
            <div className="stamp-card p-6 bg-ocean text-cream border-ink">
              <div className="sticker text-xs mb-3 bg-sun text-ink">TRASLADO DO EVENTO • R$ 50</div>
              <h3 className="text-2xl sm:text-3xl mb-2">ARENA → POLOS DE MISSÃO</h3>
              <p className="text-sm mb-3">
                Durante o evento, a organização Together leva os voluntários da Arena Pernambuco até os
                <strong> 8 polos</strong> e traz de volta. Valor único: <strong>R$ 50 (ida e volta)</strong>.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-display">
                {["RECIFE","FERNANDO DE NORONHA","CARUARU","MACEIÓ","JOÃO PESSOA","NATAL","FORTALEZA","TERESINA"].map(p => (
                  <span key={p} className="bg-sun text-ink px-2 py-1 border border-ink">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 stamp-card p-5 sm:p-6 bg-ink text-cream border-sun">
            <p className="text-sm sm:text-base">
              💡 <strong>Resumo dos traslados:</strong> O <strong>ônibus do distrito</strong> (Piripiri ↔ Arena) é organizado
              pela coordenação local — valor a definir. O <strong>traslado do evento</strong> (Arena ↔ Polos) custa
              <strong> R$ 50</strong> e é pago à organização Together.
            </p>
          </div>
        </div>
      </section>

      {/* APP */}
      <section id="app" className="bg-ink text-cream py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="sticker mb-6">APP OFICIAL</div>
          <h2 className="text-5xl md:text-7xl mb-6">
            BAIXE O <span className="text-sun">TOGETHER MOVEMENT</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-10">
            A inscrição é <strong>individual e feita pelo app</strong>. O diretor jovem pode comprar
            vouchers em lote e enviar para cada jovem acessar.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=br.com.togethermission.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stamp px-8 py-4 text-lg"
            >
              ▶ GOOGLE PLAY
            </a>
            <a
              href="https://apps.apple.com/us/app/together-movement/id6755253318"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stamp px-8 py-4 text-lg"
            >
               APP STORE
            </a>
          </div>
        </div>
      </section>

      {/* INSCRIÇÃO */}
      <section id="inscricao" className="py-24 px-6 bg-sun grain">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="sticker mb-4">INSCRIÇÃO DE INTERESSE • ÔNIBUS</div>
            <h2 className="text-5xl md:text-7xl">
              GARANTA SUA VAGA<br />NO ÔNIBUS DE <span className="bg-ocean text-cream px-3">PIRIPIRI</span>
            </h2>
            <p className="mt-6 text-lg">
              Preencha abaixo para o diretor jovem do distrito organizar o traslado.
              Em seguida, finalize a inscrição oficial no app Together.
            </p>
          </div>
          <InscricaoForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-cream py-12 px-6 border-t-4 border-sun">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-display text-3xl mb-2">TOGETHER<span className="text-ocean">.</span>PIRIPIRI</div>
            <p className="text-sm text-cream/70">
              Distrito Piripiri • IASD Central, São João e demais igrejas.
            </p>
          </div>
          <div>
            <div className="font-display text-lg mb-3 text-sun">EVENTO</div>
            <p className="text-sm text-cream/80">Arena Pernambuco<br />Novembro de 2026<br />4 dias de missão</p>
          </div>
          <div>
            <div className="font-display text-lg mb-3 text-sun">CONTATO</div>
            <p className="text-sm text-cream/80">
              Falar com o diretor jovem do seu clube.<br />
              Site oficial: <a className="underline" href="https://www.togethernordeste.com" target="_blank" rel="noopener noreferrer">togethernordeste.com</a>
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-cream/20 text-xs text-cream/50 text-center">
          Página não oficial criada para o Distrito Piripiri • © 2026
        </div>
      </footer>
    </main>
  );
}
