import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert("Usuário ou senha incorretos!");
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inscricoes")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setInscricoes(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao carregar inscrições.");
    } finally {
      setLoading(false);
    }
  }

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(inscricoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscricoes");
    XLSX.writeFile(workbook, "inscricoes_together.xlsx");
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="stamp-card p-8 w-full max-w-md space-y-4">
          <h2 className="font-display text-2xl text-center">ADMIN ACESSO</h2>
          <div>
            <label className="block text-sm font-display mb-1">USUÁRIO</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border-2 border-ink p-2 focus:ring-4 focus:ring-ocean/40 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-display mb-1">SENHA</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border-2 border-ink p-2 focus:ring-4 focus:ring-ocean/40 outline-none"
            />
          </div>
          <button type="submit" className="btn-stamp w-full py-3">ENTRAR</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="font-display text-4xl">GERENCIAMENTO</h2>
        <div className="flex gap-2">
          <button onClick={fetchData} className="px-4 py-2 border-2 border-ink hover:bg-cream transition text-sm font-display">
            ATUALIZAR
          </button>
          <button onClick={exportToExcel} className="btn-stamp px-4 py-2 text-sm">
            EXPORTAR EXCEL (.XLSX)
          </button>
        </div>
      </div>

      {error && <p className="text-destructive font-bold">{error}</p>}

      <div className="overflow-x-auto border-2 border-ink bg-cream">
        <table className="w-full text-left border-collapse">
          <thead className="bg-ink text-sun font-display text-sm">
            <tr>
              <th className="p-3 border-r border-sun/20">DATA</th>
              <th className="p-3 border-r border-sun/20">NOME</th>
              <th className="p-3 border-r border-sun/20">CPF</th>
              <th className="p-3 border-r border-sun/20">IDADE</th>
              <th className="p-3 border-r border-sun/20">IGREJA</th>
              <th className="p-3">WHATSAPP</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center">Carregando...</td></tr>
            ) : (
              inscricoes.map((item) => (
                <tr key={item.id} className="border-b border-ink/10 hover:bg-ocean/5 transition">
                  <td className="p-3 border-r border-ink/10">
                    {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 border-r border-ink/10 font-bold uppercase">{item.nome}</td>
                  <td className="p-3 border-r border-ink/10 font-mono">{item.cpf}</td>
                  <td className="p-3 border-r border-ink/10">{item.idade}</td>
                  <td className="p-3 border-r border-ink/10">{item.igreja}</td>
                  <td className="p-3 font-mono">{item.telefone}</td>
                </tr>
              ))
            )}
            {!loading && inscricoes.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center">Nenhuma inscrição encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-ink/60">Total de inscritos: {inscricoes.length}</p>
    </div>
  );
}
