import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function PetitionSignForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    cnf: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    message: "",
    agreeToShare: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const signMutation = trpc.petition.sign.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        fullName: "",
        cnf: "",
        whatsapp: "",
        email: "",
        city: "",
        state: "",
        message: "",
        agreeToShare: false,
      });
      setError("");
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error: any) => {
      const msg = error.message || "";
      if (msg.includes("Unexpected token") || msg.includes("is not valid JSON") || msg.includes("Page Not Found")) {
        setError("Este formulário requer um servidor ativo para processar os dados. No momento, você está na versão estática (GitHub). Por favor, utilize o link do Railway para assinar a petição.");
      } else {
        setError(msg || "Erro ao registrar assinatura. Tente novamente.");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!formData.fullName.trim()) {
      setError("Nome completo é obrigatório");
      return;
    }
    if (!formData.cnf.trim()) {
      setError("CNF (Cadastro Nacional de Filiação) é obrigatório");
      return;
    }
    if (!formData.whatsapp.trim()) {
      setError("WhatsApp é obrigatório");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return;
    }
    if (!formData.city.trim()) {
      setError("Cidade é obrigatória");
      return;
    }
    if (!formData.state) {
      setError("Estado é obrigatório");
      return;
    }

    signMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="bg-white border border-border p-8 shadow-xl rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Assine a Petição</h3>
        </div>
        
        <p className="text-foreground/70 mb-8 leading-relaxed">
          Registre seu apoio contra a descaracterização do PT no Ceará. Seus dados são confidenciais e usados apenas para esta mobilização.
        </p>

        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-green-800">Assinatura registrada com sucesso!</p>
              <p className="text-sm text-green-700">Obrigado por apoiar a luta pelo PT autêntico.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 uppercase text-xs tracking-wider">Atenção</p>
              <p className="text-sm text-red-700 leading-snug">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
              Nome Completo *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* CNF */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
                CNF (Cadastro Nacional) *
              </label>
              <input
                type="text"
                name="cnf"
                value={formData.cnf}
                onChange={handleChange}
                placeholder="000.000.000"
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                required
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
                WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="(85) 99999-9999"
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@exemplo.com"
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              required
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
                Cidade *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Sua cidade"
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state-select" className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
                UF *
              </label>
              <select
                id="state-select"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                required
              >
                <option value="">--</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mensagem (Opcional) */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/60 uppercase tracking-widest">
              Mensagem (Opcional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Registre seu comentário..."
              rows={3}
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
            />
          </div>

          {/* Consentimento */}
          <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg border border-border/50">
            <input
              type="checkbox"
              name="agreeToShare"
              id="agreeToShare"
              checked={formData.agreeToShare}
              onChange={handleChange}
              className="mt-1 w-4 h-4 accent-primary"
            />
            <label htmlFor="agreeToShare" className="text-xs text-foreground/70 leading-normal font-medium">
              Concordo que meu nome e cidade possam ser compartilhados publicamente como apoiador(a) desta mobilização nacional.
            </label>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={signMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-lg transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {signMutation.isPending ? "Processando..." : "ASSINAR PETIÇÃO AGORA"}
          </Button>

          <p className="text-[10px] text-foreground/40 text-center uppercase font-bold tracking-tighter">
            * Seus dados estão protegidos pela LGPD e serão usados apenas para esta mobilização.
          </p>
        </form>
      </Card>
    </div>
  );
}
