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
  const [sucesso, setSucesso] = useState(false);

  // Estados para edição
  const [editNome, setEditNome] = useState("");
  const [editIgreja, setEditIgreja] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editObs, setEditObs] = useState("");

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setInscricao(null);
    setSucesso(false);

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
        // Preencher estados de edição
        setEditNome(data.nome);
        setEditIgreja(data.igreja);
        setEditTelefone(data.telefone);
        setEditObs(data.observacoes || "");
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setErro("Ocorreu um erro ao buscar sua inscrição.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleAtualizar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const { error } = await supabase
        .from("inscricoes")
        .update({
          nome: editNome,
          igreja: editIgreja,
          telefone: editTelefone.replace(/\D/g, ""),
          observacoes: editObs,
        })
        .eq("id", inscricao.id);

      if (error) throw error;
      setSucesso(true);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setErro("Erro ao atualizar seus dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (inscricao && !sucesso) {
    return (
      <form onSubmit={handleAtualizar} className="stamp-card p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="sticker text-2xl mb-4 bg-ocean text-cream">CONFIRME SEUS DADOS</div>
        <p className="text-sm text-ink/70">Verifique se suas informações estão corretas antes de prosseguir para o pagamento.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-display mb-1">NOME COMPLETO</label>
            <input
              required
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              className="w-full border-2 border-ink p-3 bg-cream focus:ring-4 focus:ring-ocean/40 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-display mb-1">IGREJA</label>
              <input
                required
                value={editIgreja}
                onChange={(e) => setEditIgreja(e.target.value)}
                className="w-full border-2 border-ink p-3 bg-cream focus:ring-4 focus:ring-ocean/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-display mb-1">WHATSAPP</label>
              <input
                required
                value={editTelefone}
                onChange={(e) => setEditTelefone(e.target.value)}
                className="w-full border-2 border-ink p-3 bg-cream focus:ring-4 focus:ring-ocean/40 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-display mb-1">OBSERVAÇÕES (OPCIONAL)</label>
            <textarea
              value={editObs}
              onChange={(e) => setEditObs(e.target.value)}
              className="w-full border-2 border-ink p-3 bg-cream focus:ring-4 focus:ring-ocean/40 outline-none"
              rows={2}
            />
          </div>
        </div>

        {erro && <p className="text-destructive text-sm font-bold">⚠️ {erro}</p>}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={carregando}
            className="btn-stamp w-full py-4 text-xl disabled:opacity-50"
          >
            {carregando ? "SALVANDO..." : "CONFIRMAR E IR PARA PAGAMENTO →"}
          </button>
          <button 
            type="button"
            onClick={() => setInscricao(null)} 
            className="text-sm underline text-ink/60 hover:text-ocean transition"
          >
            Não é você? Voltar para a busca
          </button>
        </div>
      </form>
    );
  }

  if (sucesso) {
    return (
      <div className="stamp-card p-6 md:p-10 space-y-6 animate-in zoom-in duration-300">
        <div className="sticker text-2xl mb-4 bg-sun text-ink">DADOS CONFIRMADOS!</div>
        <h3 className="text-3xl font-display">Pronto, {editNome.split(" ")[0]}!</h3>
        
        <div className="bg-cream border-2 border-ink p-5 space-y-4">
          <p className="text-lg">
            Sua inscrição para o ônibus de <strong>Piripiri</strong> está atualizada e confirmada.
          </p>
          <div className="pt-4 border-t border-ink/10">
            <h4 className="font-display text-xl mb-2 text-ocean">PAGAMENTO DO TRASLADO</h4>
            <p className="text-sm mb-4">
              O valor do traslado Piripiri ↔ Arena Pernambuco está <strong>a definir</strong>.
            </p>
            <div className="bg-sun p-6 border-2 border-ink text-center">
              <p className="font-display text-2xl">ÁREA DE PAGAMENTO</p>
              <p className="text-sm text-ink/70 mt-2">
                O sistema de pagamentos via Cartão e PIX será liberado assim que o valor oficial for confirmado.
              </p>
              <div className="mt-4 p-3 bg-ink text-sun text-xs uppercase tracking-widest">
                EM BREVE • SISTEMA EM MANUTENÇÃO
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => { setSucesso(false); setInscricao(null); }} 
          className="btn-stamp w-full py-3"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBuscar} className="stamp-card p-6 md:p-10 space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-display uppercase tracking-tight">PAGAR MEU ÔNIBUS</h3>
        <p className="text-sm text-ink/70">Informe seus dados para localizar sua inscrição.</p>
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

