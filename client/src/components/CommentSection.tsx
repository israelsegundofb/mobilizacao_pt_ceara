import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, CheckCircle, Clock } from "lucide-react";

export default function CommentSection({ postId }: { postId: number }) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");
  const { data: comments, refetch, isLoading } = trpc.blog.getComments.useQuery({ postId });
  const addComment = trpc.blog.addComment.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setAuthorName("");
      setContent("");
      setError("");
      setTimeout(() => setSubmitted(false), 8000);
      refetch();
    },
    onError: (err: any) => {
      const msg = err.message || "";
      if (msg.includes("Unexpected token") || msg.includes("is not valid JSON") || msg.includes("Page Not Found")) {
        setError("A postagem de comentários requer um servidor ativo. Por favor, utilize o link do Railway.");
      } else {
        setError(msg || "Erro ao enviar comentário. Tente novamente.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!authorName.trim() || !content.trim()) return;
    addComment.mutate({ postId, authorName, content });
  };

  return (
    <div className="mt-16 space-y-12 max-w-2xl mx-auto px-4 sm:px-0">
      <h3 className="text-2xl font-black border-b-2 border-primary/20 pb-4 flex items-center gap-3 uppercase tracking-tighter">
        <MessageCircle className="w-6 h-6 text-primary" />
        Comentários ({comments?.length || 0})
      </h3>

      {/* Form Section */}
      <div className="bg-white border border-border p-8 rounded-2xl shadow-sm">
        <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-foreground/40">Participe da discussão</h4>
        
        {submitted ? (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Comentário recebido!</p>
              <p className="text-xs">Sua opinião foi enviada e aguarda moderação para ser publicada.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40">Seu Nome Completo</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:border-primary outline-none text-sm transition-all font-medium text-foreground"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40">Sua Opinião</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva seu comentário aqui..."
                rows={4}
                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:border-primary outline-none text-sm transition-all font-medium text-foreground resize-none"
                required
              ></textarea>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={addComment.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs py-4 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {addComment.isPending ? "Processando..." : "Publicar Comentário"}
            </button>
          </form>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-secondary/20 animate-pulse rounded-2xl border border-border"></div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-6 bg-white border border-border rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="font-black uppercase tracking-tight text-sm flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  {comment.authorName}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('pt-BR') : 'Recentemente'}
                </span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed font-serif pl-10 border-l-2 border-secondary">
                "{comment.content}"
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-secondary/10 rounded-3xl border-2 border-dashed border-border px-6">
            <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Nenhum comentário ainda. Seja o primeiro a participar da mobilização!</p>
          </div>
        )}
      </div>
    </div>
  );
}
