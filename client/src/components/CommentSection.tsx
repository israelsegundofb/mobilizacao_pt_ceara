import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/card";
import { User, MessageCircle, CheckCircle, Clock } from "lucide-react";

export default function CommentSection({ postId }: { postId: number }) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: comments, refetch, isLoading } = trpc.blog.getComments.useQuery({ postId });
  const addComment = trpc.blog.addComment.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setAuthorName("");
      setContent("");
      setTimeout(() => setSubmitted(false), 5000);
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    addComment.mutate({ postId, authorName, content });
  };

  return (
    <div className="mt-12 space-y-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold border-b border-red-900/30 pb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-red-500" />
        Comentários ({comments?.length || 0})
      </h3>

      {/* Form Section */}
      <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-lg">
        <h4 className="font-semibold mb-4 text-red-300">Deixe um comentário</h4>
        
        {submitted ? (
          <div className="flex items-center gap-3 p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300">
            <CheckCircle className="w-5 h-5" />
            <p>Comentário enviado com sucesso e aguardando aprovação.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1">Seu Nome</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-black/50 border border-red-900/30 rounded px-4 py-2 focus:border-red-500 outline-none text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1">Seu Comentário</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Deixe sua opinião..."
                rows={4}
                className="w-full bg-black/50 border border-red-900/30 rounded px-4 py-2 focus:border-red-500 outline-none text-sm transition-all"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={addComment.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-all disabled:opacity-50"
            >
              {addComment.isPending ? "Enviando..." : "Enviar Comentário"}
            </button>
          </form>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-red-900/10 rounded-lg"></div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-red-950/10 border-l-4 border-red-600 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold flex items-center gap-2 text-red-300">
                  <User className="w-4 h-4" />
                  {comment.authorName}
                </span>
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('pt-BR') : 'Agora'}
                </span>
              </div>
              <p className="text-sm text-red-100 leading-relaxed italic border-t border-red-900/20 pt-2">
                "{comment.content}"
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-red-400 text-sm">Ainda não há comentários. Seja o primeiro a opinar!</p>
        )}
      </div>
    </div>
  );
}
