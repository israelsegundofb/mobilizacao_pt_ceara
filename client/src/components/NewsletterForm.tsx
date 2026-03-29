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
      const msg = err.message || "";
      if (msg.includes("Unexpected token") || msg.includes("is not valid JSON") || msg.includes("Page Not Found")) {
        setError("Este recurso requer um servidor ativo. Por favor, utilize o link do Railway.");
      } else {
        setError(msg || "Erro ao se inscrever. Tente novamente.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    subscribe.mutate({ name, email });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-border shadow-lg rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Fique por dentro</h3>
      </div>
      <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
        Receba alertas sobre novas denúncias e eventos da nossa mobilização direta no seu e-mail.
      </p>

      {submitted ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Inscrição realizada!</p>
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
            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all text-foreground placeholder-foreground/30 font-medium"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@e-mail.com"
            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all text-foreground placeholder-foreground/30 font-medium"
            required
          />
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 mt-2 p-2 bg-red-50 border border-red-100 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {subscribe.isPending ? "Processando..." : "Quero Participar"}
          </button>
        </form>
      )}
    </div>
  );
}
