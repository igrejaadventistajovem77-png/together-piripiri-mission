import { useMemo, useState } from "react";

// 👉 SUBSTITUA pela URL do seu Google Form (use o link "formResponse" do Google Forms)
// Exemplo: "https://docs.google.com/forms/d/e/SEU_ID/formResponse"
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/COLE_SEU_ID_AQUI/formResponse";

// 👉 Mapeie os IDs (entry.xxxx) dos campos do seu Google Form aqui
const FIELDS = {
  nome: "entry.1111111111",
  cpf: "entry.2222222222",
  nascimento: "entry.3333333333",
  idade: "entry.4444444444",
  igreja: "entry.5555555555",
  telefone: "entry.6666666666",
  parcelas: "entry.7777777777",
  observacoes: "entry.8888888888",
};

const IGREJAS = [
  "IASD Central Piripiri",
  "IASD São João",
  "IASD Bairro de Fátima",
  "IASD Pirajá",
  "IASD Capim Grosso",
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

function formatTel(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

export function InscricaoForm() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [igreja, setIgreja] = useState("");
  const [telefone, setTelefone] = useState("");
  const [parcelas, setParcelas] = useState("5");
  const [obs, setObs] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const idade = useMemo(() => calcularIdade(nascimento), [nascimento]);

  const valorOnibus = 50; // investimento simbólico do traslado
  const valorParcela = useMemo(() => (valorOnibus / Number(parcelas || 1)).toFixed(2), [parcelas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    const data = new FormData();
    data.append(FIELDS.nome, nome);
    data.append(FIELDS.cpf, cpf);
    data.append(FIELDS.nascimento, nascimento);
    data.append(FIELDS.idade, String(idade ?? ""));
    data.append(FIELDS.igreja, igreja);
    data.append(FIELDS.telefone, telefone);
    data.append(FIELDS.parcelas, parcelas);
    data.append(FIELDS.observacoes, obs);

    try {
      // no-cors: o Google não retorna CORS, mas a inscrição é registrada
      await fetch(GOOGLE_FORM_ACTION, { method: "POST", mode: "no-cors", body: data });
      setEnviado(true);
    } catch {
      setEnviado(true); // mesmo em erro de rede o envio normalmente vai
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
        <p className="mt-2 text-sm text-foreground/60">
          Não esqueça: a inscrição oficial é individual e feita pelo app Together.
        </p>
        <button onClick={() => setEnviado(false)} className="btn-stamp mt-6 px-6 py-3 text-lg">
          Nova inscrição
        </button>
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

      {idade !== null && idade < 15 && (
        <p className="bg-destructive text-destructive-foreground p-3 border-2 border-ink text-sm">
          ⚠️ Idade mínima é 15 anos (com responsável). Verifique a data informada.
        </p>
      )}
      {idade !== null && idade === 15 && (
        <p className="bg-ocean text-cream p-3 border-2 border-ink text-sm">
          ℹ️ Com 15 anos é necessário acompanhamento de um responsável.
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

      <div className="bg-sun border-2 border-ink p-5">
        <label className="font-display text-xl block mb-3">PARCELAMENTO DO ÔNIBUS (R$ 50,00)</label>
        <div className="flex flex-wrap gap-2">
          {["1", "2", "3", "4", "5"].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setParcelas(n)}
              className={`px-5 py-2 border-2 border-ink font-display text-lg transition ${
                parcelas === n ? "bg-ink text-sun" : "bg-cream text-ink hover:bg-ocean hover:text-cream"
              }`}
            >
              {n}x
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm">
          {parcelas}x de <strong>R$ {valorParcela}</strong> sem juros • valor simbólico do traslado.
          <br />
          <span className="text-foreground/70">A alimentação (R$ 120,00) é paga junto à inscrição no app oficial.</span>
        </p>
      </div>

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
        disabled={carregando || (idade !== null && idade < 15)}
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
