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
      setError(error.message || "Erro ao registrar assinatura. Tente novamente.");
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
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-red-900/30 border-red-700/50 p-8">
        <h3 className="text-2xl font-bold mb-2 text-red-300">Assine a Petição</h3>
        <p className="text-red-200 mb-6">
          Registre seu apoio contra a descaracterização do PT no Ceará. Seus dados são confidenciais e usados apenas para esta mobilização.
        </p>

        {submitted && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-300">Assinatura registrada com sucesso!</p>
              <p className="text-sm text-green-200">Obrigado por apoiar a luta pelo PT autêntico.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Erro ao registrar</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* CNF */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-2">
              CNF (Cadastro Nacional de Filiação) *
            </label>
            <input
              type="text"
              name="cnf"
              value={formData.cnf}
              onChange={handleChange}
              placeholder="Seu número de CNF"
              className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="(85) 99999-9999"
              className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-red-300 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Sua cidade"
                className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-2">
                Estado *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                required
              >
                <option value="">Selecione</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mensagem (Opcional) */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-2">
              Sua Mensagem (Opcional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Deixe sua mensagem de apoio..."
              rows={3}
              className="w-full px-4 py-2 bg-black/50 border border-red-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          {/* Consentimento */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeToShare"
              id="agreeToShare"
              checked={formData.agreeToShare}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="agreeToShare" className="text-sm text-red-200">
              Concordo que meu nome e cidade possam ser compartilhados publicamente como apoiador(a) desta mobilização.
            </label>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={signMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signMutation.isPending ? "Registrando..." : "Assinar Petição"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            * Campos obrigatórios
          </p>
        </form>
      </Card>
    </div>
  );
}
