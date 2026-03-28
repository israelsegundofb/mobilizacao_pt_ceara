import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Save, LogOut, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ContentItem {
  id: number;
  key: string;
  title: string;
  content: string;
  section: string;
  type: string;
}

export default function ContentEditor() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: contentData, isLoading: isLoadingContent } = trpc.content.getAll.useQuery();
  const updateMutation = trpc.content.update.useMutation();

  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [contentBySection, setContentBySection] = useState<Record<string, ContentItem[]>>({});

  // Redirecionar se não for admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  // Organizar conteúdo por seção
  useEffect(() => {
    if (contentData) {
      const grouped: Record<string, ContentItem[]> = {};
      contentData.forEach((item: ContentItem) => {
        if (!grouped[item.section]) {
          grouped[item.section] = [];
        }
        grouped[item.section].push(item);
        // Inicializar com conteúdo atual
        if (!editingContent[item.key]) {
          setEditingContent((prev) => ({ ...prev, [item.key]: item.content }));
        }
      });
      setContentBySection(grouped);
    }
  }, [contentData]);

  const handleSave = async (key: string) => {
    try {
      await updateMutation.mutateAsync({
        key,
        value: editingContent[key] || "",
      });
      toast.success("Conteúdo atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar conteúdo");
    }
  };

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

  const sections = Object.keys(contentBySection).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/admin")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⭐</span>
            </div>
            <span className="font-bold text-lg">Editor de Conteúdo</span>
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
        {isLoadingContent ? (
          <div className="text-center text-gray-400">Carregando conteúdo...</div>
        ) : sections.length === 0 ? (
          <div className="text-center text-gray-400">Nenhum conteúdo disponível</div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section}>
                <h2 className="text-2xl font-bold mb-4 text-red-400 capitalize">{section}</h2>
                <div className="space-y-4">
                  {contentBySection[section].map((item: ContentItem) => (
                    <Card key={item.key} className="bg-gray-800 border-gray-700 p-6">
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-red-300 mb-2">
                          {item.title}
                        </label>
                        <p className="text-xs text-gray-500 mb-3">Chave: {item.key}</p>

                        {item.type === "textarea" || item.type === "description" ? (
                          <textarea
                            value={editingContent[item.key] || ""}
                            onChange={(e) =>
                              setEditingContent((prev) => ({
                                ...prev,
                                [item.key]: e.target.value,
                              }))
                            }
                            rows={4}
                            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editingContent[item.key] || ""}
                            onChange={(e) =>
                              setEditingContent((prev) => ({
                                ...prev,
                                [item.key]: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                          />
                        )}
                      </div>

                      <Button
                        onClick={() => handleSave(item.key)}
                        disabled={updateMutation.isPending}
                        className="gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <Save className="w-4 h-4" />
                        {updateMutation.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
