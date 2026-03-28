import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Edit2, Trash2, Eye, Plus } from "lucide-react";
import BlogEditor from "@/components/BlogEditor";
import { toast } from "sonner";

export default function BlogManagement() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: posts, isLoading: isLoadingPosts, refetch } = trpc.blog.getAll.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

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

  const handleSave = async (data: any) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...data,
        });
        toast.success("Post atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Post criado com sucesso!");
      }
      setIsEditing(false);
      setEditingId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Post deletado com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar post");
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
            }}
            variant="outline"
            className="mb-6"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold mb-8">
            {editingId ? "Editar Post" : "Novo Post"}
          </h1>
          <BlogEditor onSave={handleSave} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Post
          </Button>
        </div>

        {isLoadingPosts ? (
          <p>Carregando posts...</p>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post: any) => (
              <Card key={post.id} className="bg-red-900/30 border-red-700/50 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-red-200 mb-2">{post.excerpt}</p>
                    <div className="flex gap-4 text-sm text-red-300">
                      <span>Categoria: {post.category}</span>
                      <span>Visualizações: {post.views}</span>
                      <span>Status: {post.published ? "Publicado" : "Rascunho"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(post.id);
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-red-900/30 border-red-700/50 p-8 text-center">
            <p className="text-red-200 mb-4">Nenhum post criado ainda</p>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              Criar Primeiro Post
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
