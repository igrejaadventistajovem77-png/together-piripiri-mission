import { useState } from "react";
import { supabase } from "@/lib/supabase";

function formatCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfs = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((cpfs.slice(0, count - 12).reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11) % 10;
  return rest(10) === cpfs[9] && rest(11) === cpfs[10];
}

export function PagamentoBusca() {
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [inscricao, setInscricao] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setInscricao(null);

    if (!validarCPF(cpf)) {
      setErro("O CPF informado é inválido. Verifique os números.");
      setCarregando(false);
      return;
    }

    try {
      const cleanCpf = cpf.replace(/\D/g, "");
      const { data, error } = await supabase
        .from("inscricoes")
        .select("*")
        .eq("cpf", cleanCpf)
        .eq("nascimento", nascimento)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErro("Inscrição não encontrada. Verifique os dados ou inscreva-se primeiro.");
      } else {
        setInscricao(data);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setErro("Ocorreu um erro ao buscar sua inscrição.");
    } finally {
      setCarregando(false);
    }
  }

  if (inscricao) {
    return (
      <div className="stamp-card p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="sticker text-2xl mb-4 bg-ocean text-cream">INSCRIÇÃO ENCONTRADA</div>
        <h3 className="text-3xl font-display">Olá, {inscricao.nome.split(" ")[0]}!</h3>
        
        <div className="bg-cream border-2 border-ink p-5 space-y-3">
          <p className="text-lg">
            Sua inscrição para o ônibus de <strong>Piripiri</strong> está confirmada no sistema.
          </p>
          <div className="pt-4 border-t border-ink/10">
            <h4 className="font-display text-xl mb-2 text-ocean">PAGAMENTO DO ÔNIBUS</h4>
            <p className="text-sm">
              O valor do traslado Piripiri ↔ Arena Pernambuco está <strong>a definir</strong>.
            </p>
            {/* Aqui entrará a lógica de cartão/pagamento no futuro */}
            <div className="mt-6 bg-sun p-4 border-2 border-ink text-center">
              <p className="font-display text-lg">ÁREA DE PAGAMENTO</p>
              <p className="text-xs text-ink/60 mt-1">Em breve você poderá pagar seu traslado por aqui via Cartão ou PIX.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setInscricao(null)} 
          className="text-sm underline text-ink/60 hover:text-ocean transition"
        >
          Buscar outro CPF
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBuscar} className="stamp-card p-6 md:p-10 space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-display">PAGAR MEU ÔNIBUS</h3>
        <p className="text-sm text-ink/70">Informe seus dados para localizar sua inscrição e realizar o pagamento.</p>
      </div>

      <div>
        <label className="font-display text-xl block mb-2">CPF</label>
        <input
          required
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          inputMode="numeric"
          className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <label className="font-display text-xl block mb-2">DATA DE NASCIMENTO</label>
        <input
          required
          type="date"
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
          className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
        />
      </div>

      {erro && (
        <p className="bg-destructive text-destructive-foreground p-3 border-2 border-ink text-sm">
          ⚠️ {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="btn-stamp w-full py-5 text-2xl disabled:opacity-50"
      >
        {carregando ? "BUSCANDO..." : "BUSCAR INSCRIÇÃO →"}
      </button>
    </form>
  );
}
