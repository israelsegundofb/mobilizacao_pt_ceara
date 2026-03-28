import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  Download, LogOut, Users, Mail, MessageSquare, 
  Image as ImageIcon, Calendar, Trash2, Check, Plus, ExternalLink 
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  // Queries
  const { data: signatures = [], isLoading: isLoadingSignatures } = trpc.petition.getAll.useQuery();
  const { data: subscribers = [], isLoading: isLoadingSubscribers } = trpc.newsletter.getAll.useQuery();
  const { data: comments = [], isLoading: isLoadingComments } = trpc.blog.getAllComments.useQuery();
  const { data: gallery = [], isLoading: isLoadingGallery } = trpc.gallery.getAll.useQuery();
  const { data: timeline = [], isLoading: isLoadingTimeline } = trpc.timeline.getAll.useQuery();

  // Mutations
  const approveComment = trpc.blog.approveComment.useMutation({
    onSuccess: () => {
      toast.success("Comentário aprovado!");
      utils.blog.getAllComments.invalidate();
    }
  });

  const deleteComment = trpc.blog.deleteComment.useMutation({
    onSuccess: () => {
      toast.success("Comentário excluído!");
      utils.blog.getAllComments.invalidate();
    }
  });

  const addGalleryItem = trpc.gallery.add.useMutation({
    onSuccess: () => {
      toast.success("Item adicionado à galeria!");
      utils.gallery.getAll.invalidate();
    }
  });

  const deleteGalleryItem = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Item removido da galeria!");
      utils.gallery.getAll.invalidate();
    }
  });

  const addTimelineEvent = trpc.timeline.add.useMutation({
    onSuccess: () => {
      toast.success("Evento adicionado à timeline!");
      utils.timeline.getAll.invalidate();
    }
  });

  const deleteTimelineEvent = trpc.timeline.delete.useMutation({
    onSuccess: () => {
      toast.success("Evento removido da timeline!");
      utils.timeline.getAll.invalidate();
    }
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Carregando...</p></div>;
  if (!user || user.role !== "admin") return null;

  const downloadSignatures = () => {
    const data = signatures.map((sig: any) => ({
      "Nome": sig.fullName, "CNF": sig.cnf, "WhatsApp": sig.whatsapp, 
      "Email": sig.email, "Cidade": sig.city, "Estado": sig.state,
      "Data": new Date(sig.createdAt).toLocaleDateString("pt-BR")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assinaturas");
    XLSX.writeFile(wb, `Assinaturas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadSubscribers = () => {
    const data = subscribers.map((sub: any) => ({
      "Nome": sub.name || "N/A", "Email": sub.email, 
      "Data": new Date(sub.createdAt).toLocaleDateString("pt-BR")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Newsletter");
    XLSX.writeFile(wb, `Newsletter_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">⭐</span></div>
            <span className="font-bold text-lg">Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Olá, {user.name}</span>
            <Button onClick={() => { logout(); setLocation("/"); }} variant="outline" size="sm" className="gap-2"><LogOut className="w-4 h-4" /> Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="signatures" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="signatures" className="gap-2"><Users className="w-4 h-4" /> Assinaturas</TabsTrigger>
            <TabsTrigger value="newsletter" className="gap-2"><Mail className="w-4 h-4" /> Newsletter</TabsTrigger>
            <TabsTrigger value="comments" className="gap-2"><MessageSquare className="w-4 h-4" /> Comentários</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2"><ImageIcon className="w-4 h-4" /> Galeria</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2"><Calendar className="w-4 h-4" /> Timeline</TabsTrigger>
          </TabsList>

          {/* Signatures Tab */}
          <TabsContent value="signatures">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Assinaturas Coletadas</h2>
                  <p className="text-sm text-gray-400 mt-1">{signatures.length} assinaturas registradas</p>
                </div>
                <Button onClick={downloadSignatures} className="gap-2 bg-red-600 hover:bg-red-700"><Download className="w-4 h-4" /> Exportar</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Nome</th>
                      <th className="px-6 py-3 text-left">WhatsApp</th>
                      <th className="px-6 py-3 text-left">Cidade</th>
                      <th className="px-6 py-3 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signatures.map((sig: any) => (
                      <tr key={sig.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-6 py-4">{sig.fullName}</td>
                        <td className="px-6 py-4">{sig.whatsapp}</td>
                        <td className="px-6 py-4">{sig.city}</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(sig.createdAt).toLocaleDateString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Inscritos na Newsletter</h2>
                  <p className="text-sm text-gray-400 mt-1">{subscribers.length} contatos coletados</p>
                </div>
                <Button onClick={downloadSubscribers} className="gap-2 bg-red-600 hover:bg-red-700"><Download className="w-4 h-4" /> Exportar</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Nome</th>
                      <th className="px-6 py-3 text-left">E-mail</th>
                      <th className="px-6 py-3 text-left">Inscrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-6 py-4">{sub.name || "-"}</td>
                        <td className="px-6 py-4">{sub.email}</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(sub.createdAt).toLocaleDateString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">Moderação de Comentários</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Autor</th>
                      <th className="px-6 py-3 text-left">Conteúdo</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment: any) => (
                      <tr key={comment.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-6 py-4">{comment.authorName}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{comment.content}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${comment.published ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {comment.published ? 'Publicado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {!comment.published && (
                            <Button size="sm" variant="outline" className="h-8 border-green-700 text-green-400 hover:bg-green-900/30" onClick={() => approveComment.mutate({ id: comment.id })}>
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-8 border-red-700 text-red-400 hover:bg-red-900/30" onClick={() => deleteComment.mutate({ id: comment.id })}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-gray-800 border-gray-700 p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-red-500" /> Novo Item</h3>
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addGalleryItem.mutate({
                      type: formData.get("type") as any,
                      url: formData.get("url") as string,
                      caption: formData.get("caption") as string
                    });
                    (e.target as HTMLFormElement).reset();
                  }}>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tipo</label>
                      <select name="type" className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500">
                        <option value="photo">Foto (URL)</option>
                        <option value="video">Vídeo (YouTube/Reels URL)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">URL</label>
                      <input name="url" required className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Legenda</label>
                      <input name="caption" className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="Descrição opcional" />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={addGalleryItem.isPending}>Adicionar</Button>
                  </form>
                </Card>
                
                <Card className="lg:col-span-2 bg-gray-800 border-gray-700 overflow-hidden">
                  <div className="p-4 bg-gray-750 border-b border-gray-700"><h3 className="font-bold">Itens Atuais</h3></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
                    {gallery.map(item => (
                      <div key={item.id} className="relative group aspect-square rounded overflow-hidden bg-gray-900 border border-gray-700">
                        {item.type === 'photo' ? (
                          <img src={item.url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-red-500"><ImageIcon className="w-8 h-8 opacity-50" /><span className="text-[10px] mt-1">Vídeo</span></div>
                        )}
                        <button className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteGalleryItem.mutate({ id: item.id })}><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </Card>
             </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-red-500" /> Novo Evento</h3>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addTimelineEvent.mutate({
                      title: formData.get("title") as string,
                      description: formData.get("description") as string,
                      eventDate: new Date(formData.get("date") as string)
                    });
                    (e.target as HTMLFormElement).reset();
                  }}>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Título</label>
                    <input name="title" required className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Data</label>
                    <input name="date" type="date" required className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Descrição</label>
                    <textarea name="description" rows={3} className="w-full bg-gray-900 border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-red-500" />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={addTimelineEvent.isPending}>Adicionar Evento</Button>
                </form>
              </Card>

              <Card className="lg:col-span-2 bg-gray-800 border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700"><h3 className="font-bold">Linha do Tempo</h3></div>
                <div className="p-4 space-y-4">
                  {timeline.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700">
                      <div>
                        <p className="text-xs text-red-400 font-semibold">{new Date(event.eventDate).toLocaleDateString("pt-BR")}</p>
                        <p className="font-bold text-sm">{event.title}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => deleteTimelineEvent.mutate({ id: event.id })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
