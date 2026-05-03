import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const IGREJAS = [
  "Piripiri sede",
  "Central Pedro ll",
  "Areia Branca",
  "São João",
  "Prado",
  "Piracuruca",
  "Pequis",
  "Milton Brandão",
  "Santa Fé",
  "Jardim - Boa Hora",
  "Outra",
];

function calcularIdade(dataISO: string): number | null {
  if (!dataISO) return null;
  const hoje = new Date();
  const nasc = new Date(dataISO);
  if (isNaN(nasc.getTime())) return null;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 0 && idade < 120 ? idade : null;
}

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

function formatTel(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 3) return d.replace(/(\d{2})(\d{1})/, "$1 $2");
  if (d.length <= 7) return d.replace(/(\d{2})(\d{1})(\d{0,4})/, "$1 $2 $3");
  return d.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, "$1 $2 $3-$4");
}

function validarTelefone(tel: string): boolean {
  return tel.replace(/\D/g, "").length === 11;
}

export function InscricaoForm() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [igreja, setIgreja] = useState("");
  const [telefone, setTelefone] = useState("");
  const [obs, setObs] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const idade = useMemo(() => calcularIdade(nascimento), [nascimento]);

  const podeParticipar = useMemo(() => {
    if (idade !== null && idade >= 15) return true;
    if (!nascimento) return false;
    // Verifica se completa 15 anos até 31 de Julho de 2026
    const dataLimite = new Date("2026-07-31");
    const nasc = new Date(nascimento);
    let idadeNaData = dataLimite.getFullYear() - nasc.getFullYear();
    const m = dataLimite.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && dataLimite.getDate() < nasc.getDate())) idadeNaData--;
    return idadeNaData >= 15;
  }, [idade, nascimento]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!podeParticipar) return;
    setCarregando(true);
    setErro(null);
// ... (resto da função handleSubmit se mantém igual)

    if (!validarCPF(cpf)) {
      setErro("O CPF informado é inválido. Verifique os números.");
      setCarregando(false);
      return;
    }

    if (!validarTelefone(telefone)) {
      setErro("O telefone informado está incompleto. Use o formato: 86 9 0000-0000.");
      setCarregando(false);
      return;
    }

    const payload = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      nascimento,
      idade,
      igreja,
      telefone: telefone.replace(/\D/g, ""),
      observacoes: obs,
      criado_em: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("inscricoes")
        .insert([payload]);

      if (error) {
        if (error.code === "23505") {
          setErro("Este CPF já está inscrito. Se você já se inscreveu, pode conferir seus dados na tela de pagamento.");
        } else {
          throw error;
        }
      } else {
        setEnviado(true);
      }
    } catch (err: any) {
      console.error("Erro ao enviar inscrição:", err);
      if (!erro) {
        setErro("Houve um erro ao salvar sua inscrição. Tente novamente mais tarde.");
      }
    } finally {
      setCarregando(false);
    }
  }

  if (enviado) {
    return (
      <div className="stamp-card p-8 text-center">
        <div className="sticker text-2xl mb-4">INSCRIÇÃO RECEBIDA!</div>
        <h3 className="text-3xl mt-4">Obrigado, {nome.split(" ")[0] || "missionário"}!</h3>
        <p className="mt-3 text-foreground/80">
          Sua manifestação de interesse foi enviada para o Distrito Piripiri.
          Em breve o diretor jovem entrará em contato com instruções de pagamento e voucher do app.
        </p>
        <div className="flex flex-col gap-3 mt-8">
          <Link to="/pagamento" className="btn-stamp px-6 py-4 text-xl bg-ocean text-cream border-ocean">
            VERIFICAR MEU PAGAMENTO →
          </Link>
          <button onClick={() => setEnviado(false)} className="text-sm underline text-ink/60 hover:text-ocean transition">
            Fazer outra inscrição
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stamp-card p-6 md:p-10 space-y-5">
      <div>
        <label className="font-display text-xl block mb-2">NOME COMPLETO</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={120}
          className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
          placeholder="Seu nome como no documento"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
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
          <div className="relative">
            <input
              required
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
            />
            {idade !== null && (
              <span className="sticker absolute -top-3 -right-3 text-xs">{idade} ANOS</span>
            )}
          </div>
        </div>
      </div>

      {nascimento && !podeParticipar && (
        <p className="bg-destructive text-destructive-foreground p-3 border-2 border-ink text-sm">
          ⚠️ A idade mínima é 15 anos completos (ou completar até Julho de 2026). 
          Infelizmente você ainda não possui a idade mínima permitida.
        </p>
      )}

      {nascimento && podeParticipar && idade !== null && idade < 18 && (
        <p className="bg-ocean text-cream p-3 border-2 border-ink text-sm">
          ℹ️ <strong>Atenção:</strong> Por ser menor de 18 anos, sua participação exige a autorização e acompanhamento de um responsável legal.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="font-display text-xl block mb-2">IGREJA</label>
          <select
            required
            value={igreja}
            onChange={(e) => setIgreja(e.target.value)}
            className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
          >
            <option value="">Selecione sua igreja</option>
            {IGREJAS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-display text-xl block mb-2">WHATSAPP</label>
          <input
            required
            value={telefone}
            onChange={(e) => setTelefone(formatTel(e.target.value))}
            inputMode="tel"
            className="w-full border-2 border-ink bg-cream px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-ocean/40"
            placeholder="(86) 90000-0000"
          />
        </div>
      </div>

      {erro && (
        <p className="bg-destructive text-destructive-foreground p-3 border-2 border-ink text-sm">
          ⚠️ {erro}
        </p>
      )}


      <div>
        <label className="font-display text-xl block mb-2">OBSERVAÇÕES</label>
        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full border-2 border-ink bg-cream px-4 py-3 focus:outline-none focus:ring-4 focus:ring-ocean/40"
          placeholder="Restrições alimentares, dúvidas, etc."
        />
      </div>

      <button
        type="submit"
        disabled={carregando || !podeParticipar}
        className="btn-stamp w-full py-5 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {carregando ? "ENVIANDO..." : "QUERO PARTICIPAR →"}
      </button>

      <p className="text-xs text-center text-foreground/60">
        Esta é uma manifestação de interesse do Distrito Piripiri. A inscrição oficial é individual,
        feita pelo app Together Movement. O diretor jovem pode comprar vouchers em lote.
      </p>
    </form>
  );
}
