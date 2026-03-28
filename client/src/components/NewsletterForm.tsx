import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setName("");
      setError("");
      setTimeout(() => setSubmitted(false), 8000);
    },
    onError: (err: any) => {
      setError(err.message || "Erro ao se inscrever. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    subscribe.mutate({ name, email });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-red-900/10 border border-red-900/30 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-bold text-white">Fique por dentro</h3>
      </div>
      <p className="text-sm text-red-200 mb-6">
        Receba alertas sobre novas denúncias e eventos da nossa mobilização direta no seu e-mail.
      </p>

      {submitted ? (
        <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-start gap-3 text-green-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Inscrição realizada!</p>
            <p className="text-xs">Obrigado por se juntar à nossa luta por um PT autêntico.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu Nome (Opcional)"
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none transition-all"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@e-mail.com"
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none transition-all"
            required
          />
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {subscribe.isPending ? "Processando..." : "Quero Participar"}
          </button>
        </form>
      )}
    </div>
  );
}
