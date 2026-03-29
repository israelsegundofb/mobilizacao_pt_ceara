import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  
  // Se o usuário já estiver logado, redirecionar para o painel
  useEffect(() => {
    if (!loading && user) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/admin`;
    }
  }, [user, loading]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Login realizado com sucesso!");
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/admin`; 
    },
    onError: (error) => {
      toast.error(error.message || "Falha na autenticação. Verifique suas credenciais.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setIsSubmitting(true);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      {/* Return Button */}
      <Link href="/">
        <a className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Site
        </a>
      </Link>

      <Card className="w-full max-w-md border-t-8 border-t-primary shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-inner">
            <span className="text-white font-black text-2xl">⭐</span>
          </div>
          <CardTitle className="text-3xl font-black text-[#313131] uppercase tracking-tighter">Acesso Restrito</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Área exclusiva para coordenação e colaboradores autorizados do PT Ceará.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest opacity-70">Usuário ou Email</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu login registrado"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/20 border-border focus:ring-primary h-12"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-70">Senha de Acesso</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/20 border-border focus:ring-primary h-12"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-6 pt-6 pb-8">
            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-sm shadow-lg transform active:scale-95 transition-all"
              disabled={isSubmitting}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isSubmitting ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-green-600" />
              Ambiente de Produção Seguro
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-[11px] text-muted-foreground text-center max-w-xs leading-relaxed uppercase tracking-widest opacity-50 font-bold">
        © 2026 MOBILIZAÇÃO PT CEARÁ • ESTRELA DO POVO
      </p>
    </div>
  );
}
