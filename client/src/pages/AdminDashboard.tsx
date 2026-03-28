import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Download, LogOut, Users } from "lucide-react";
import { useEffect } from "react";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: signatureData, isLoading: isLoadingSignatures } = trpc.petition.getSignatures.useQuery();
  const { data: countData } = trpc.petition.getCount.useQuery();

  // Redirecionar se não for admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const signatures = signatureData || [];
  const totalSignatures = countData?.count || 0;

  const downloadExcel = () => {
    if (signatures.length === 0) {
      alert("Nenhuma assinatura para exportar");
      return;
    }

    // Preparar dados para o Excel
    const data = signatures.map((sig: any) => ({
      "ID": sig.id,
      "Nome Completo": sig.fullName,
      "CNF": sig.cnf,
      "WhatsApp": sig.whatsapp,
      "Email": sig.email,
      "Cidade": sig.city,
      "Estado": sig.state,
      "Data da Assinatura": new Date(sig.createdAt).toLocaleDateString("pt-BR"),
      "Hora": new Date(sig.createdAt).toLocaleTimeString("pt-BR"),
    }));

    // Criar workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assinaturas");

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 8 },   // ID
      { wch: 25 },  // Nome Completo
      { wch: 15 },  // CNF
      { wch: 18 },  // WhatsApp
      { wch: 25 },  // Email
      { wch: 20 },  // Cidade
      { wch: 10 },  // Estado
      { wch: 18 },  // Data
      { wch: 12 },  // Hora
    ];
    ws["!cols"] = colWidths;

    // Adicionar filtros
    ws["!autofilter"] = { ref: "A1:I" + (data.length + 1) };

    // Baixar arquivo
    const fileName = `Assinaturas_PT_Ceara_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⭐</span>
            </div>
            <span className="font-bold text-lg">Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Olá, {user.name || "Administrador"}</span>
            <Button
              onClick={() => {
                logout();
                setLocation("/");
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Assinaturas</p>
                <p className="text-4xl font-bold text-red-500 mt-2">{totalSignatures}</p>
              </div>
              <Users className="w-12 h-12 text-red-500/30" />
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div>
              <p className="text-gray-400 text-sm">Status da Petição</p>
              <p className="text-2xl font-bold text-green-500 mt-2">Ativa</p>
              <p className="text-xs text-gray-500 mt-2">Coletando assinaturas</p>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <Button onClick={downloadExcel} className="w-full gap-2 bg-red-600 hover:bg-red-700">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
          </Card>
        </div>

        {/* Signatures Table */}
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Assinaturas Coletadas</h2>
            <p className="text-sm text-gray-400 mt-1">
              {isLoadingSignatures ? "Carregando..." : `${signatures.length} assinatura(s) registrada(s)`}
            </p>
          </div>

          {isLoadingSignatures ? (
            <div className="p-6 text-center text-gray-400">Carregando assinaturas...</div>
          ) : signatures.length === 0 ? (
            <div className="p-6 text-center text-gray-400">Nenhuma assinatura coletada ainda.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Nome Completo</th>
                    <th className="px-6 py-3 text-left font-semibold">CNF</th>
                    <th className="px-6 py-3 text-left font-semibold">WhatsApp</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Cidade</th>
                    <th className="px-6 py-3 text-left font-semibold">Estado</th>
                    <th className="px-6 py-3 text-left font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {signatures.map((signature: any, index: number) => (
                    <tr
                      key={signature.id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-800"
                      } hover:bg-gray-700/50 transition-colors`}
                    >
                      <td className="px-6 py-4">{signature.fullName}</td>
                      <td className="px-6 py-4 font-mono text-xs">{signature.cnf}</td>
                      <td className="px-6 py-4">{signature.whatsapp}</td>
                      <td className="px-6 py-4 text-xs">{signature.email}</td>
                      <td className="px-6 py-4">{signature.city}</td>
                      <td className="px-6 py-4 font-semibold">{signature.state}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(signature.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
