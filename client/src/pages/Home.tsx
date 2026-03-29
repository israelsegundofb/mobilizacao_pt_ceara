import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Heart, Users, AlertCircle, Share2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import PetitionSignForm from "@/components/PetitionSignForm";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useParallax } from "@/hooks/useParallax";
import Timeline from "@/components/Timeline";
import MediaGallery from "@/components/MediaGallery";
import NewsletterForm from "@/components/NewsletterForm";


export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { getContent } = useSiteContent();
  const heroParallax = useParallax(0.5);
  const truthParallax = useParallax(0.3);
  const ctaParallax = useParallax(0.4);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#e4142c] text-white shadow-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#e4142c] font-bold text-sm">⭐</span>
            </div>
            <span className="font-bold text-lg">A Estrela do PT</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://blogdoedisonsilva.com.br/2026/03/26/a-agonia-da-estrela-o-pt-do-ceara-a-traicao-estatutaria-e-o-silenciamento-de-nossas-mulheres/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-md transition-colors text-[10px] font-bold uppercase tracking-wider"
            >
              Leia o Artigo Completo
            </a>
            
            <Link href="/login">
              <a className="flex items-center gap-2 bg-white text-[#e4142c] hover:bg-white/90 px-4 py-2 rounded-md transition-all text-xs font-black uppercase tracking-widest shadow-lg">
                <LogIn className="w-4 h-4" />
                {isAuthenticated ? "Painel Admin" : "Entrar"}
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <p className="text-primary text-sm font-bold uppercase tracking-widest">{getContent("hero_badge", "🔴 DENÚNCIA POLÍTICA")}</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-[#313131]">
            {getContent("hero_title", "O PT TÁ MUDANDO DE LADO NO CEARÁ?")}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {getContent("hero_subtitle", "Mulheres da luta estão sendo silenciadas. A estrela vermelha virou balcão de negócios. É hora de falar a verdade.")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.instagram.com/reel/DWZtw-VArL_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Assista o Vídeo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="https://blogdoedisonsilva.com.br/2026/03/26/a-agonia-da-estrela-o-pt-do-ceara-a-traicao-estatutaria-e-o-silenciamento-de-nossas-mulheres/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900 border border-red-500 text-red-300 font-bold py-4 px-8 rounded-lg transition-all"
            >
              Leia o Artigo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* The Truth Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center text-primary uppercase">{getContent("truth_title", "A Verdade Que Ninguém Quer Ouvir")}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "mulheres" ? null : "mulheres")}
              className="bg-white border-border hover:border-primary cursor-pointer transition-all p-8 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Users className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold">{getContent("truth_card1_title", "Nossas Mulheres Estão Sendo Caladas")}</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {getContent("truth_card1_content", "Luizianne Lins e Larissa Gaspar, que construíram o PT no suor e na luta, hoje tão sendo deixadas de lado. É uma vergonha o que tão fazendo com elas.")}
              </p>
            </Card>

            {/* Card 2 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "coroneis" ? null : "coroneis")}
              className="bg-white border-border hover:border-primary cursor-pointer transition-all p-8 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <AlertCircle className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold">{getContent("truth_card2_title", "Os Coronéis Tão Voltando")}</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {getContent("truth_card2_content", "Em nome de uma tal de \"governabilidade\", tão abrindo as portas do PT pra quem sempre foi contra a gente. Pra quem sempre defendeu os ricos e poderosos.")}
              </p>
            </Card>

            {/* Card 3 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "estrela" ? null : "estrela")}
              className="bg-white border-border hover:border-primary cursor-pointer transition-all p-8 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Heart className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold">{getContent("truth_card3_title", "A Estrela Não É Balcão de Negócios")}</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {getContent("truth_card3_content", "Essa \"união\" que eles falam é só pra trazer mais gente da direita pra dentro do partido. Tão transformando a nossa estrela vermelha num balcão de negócios pra oligarquia.")}
              </p>
            </Card>

            {/* Card 4 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "luta" ? null : "luta")}
              className="bg-white border-border hover:border-primary cursor-pointer transition-all p-8 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Share2 className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold">{getContent("truth_card4_title", "Mas a Gente Não Vai Deixar")}</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {getContent("truth_card4_content", "O PT é do povo, é da luta! E a gente vai resgatar a nossa essência. Sua voz é a força que a estrela precisa pra brilhar de novo!")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-6 text-center text-[#313131]">{getContent("timeline_title", "Cronologia da Mobilização")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Acompanhe os fatos e as decisões que nos trouxeram até aqui. A transparência é nossa maior arma.
          </p>
          <Timeline />
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center text-foreground uppercase tracking-tight">O Que Está Acontecendo</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-5xl font-black text-primary mb-2">100%</div>
              <p className="text-foreground/70 font-bold uppercase text-xs tracking-widest">Dos Princípios Estatutários Violados</p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-5xl font-black text-primary mb-2">∞</div>
              <p className="text-foreground/70 font-bold uppercase text-xs tracking-widest">Silenciamento de Mulheres Combativas</p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-5xl font-black text-primary mb-2">0</div>
              <p className="text-foreground/70 font-bold uppercase text-xs tracking-widest">Governabilidade Sem Traição</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black mb-4 text-primary">{getContent("gallery_title", "Galeria da Resistência")}</h2>
              <p className="text-foreground/70">
                Registros visuais da nossa luta em todo o Ceará. Fotos de comícios, vídeos de denúncias e a voz do povo.
              </p>
            </div>
            <NewsletterForm />
          </div>
          <MediaGallery />
        </div>
      </section>

      {/* Petition Sign Form Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center text-[#313131]">MANIFESTE SEU APOIO</h2>
          <PetitionSignForm />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-black to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Sua Voz Muda Tudo</h2>
          <p className="text-xl text-red-200 mb-8 max-w-2xl mx-auto">
            O PT é do povo, é da luta! A gente vai resgatar a nossa essência. 
            Leia o artigo completo, compartilhe com seu povo e venha com a gente nessa luta!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="https://blogdoedisonsilva.com.br/2026/03/26/a-agonia-da-estrela-o-pt-do-ceara-a-traicao-estatutaria-e-o-silenciamento-de-nossas-mulheres/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Leia o Artigo Completo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/israelfranca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900 border border-red-500 text-red-300 font-bold py-4 px-8 rounded-lg transition-all"
            >
              Siga @israelfranca
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-8">
            <p className="text-red-300 text-lg font-semibold mb-2">Compartilhe Esta Mensagem</p>
            <p className="text-red-200 mb-6">
              Copie e compartilhe com seus amigos, família e companheiros. 
              A verdade precisa chegar em todo o Ceará!
            </p>
            <div className="bg-black/50 p-4 rounded text-left text-sm text-red-300 font-mono">
              "O PT não nasceu pra ser legenda de aluguel de coronéis! Mas é isso que estamos assistindo no Ceará. Leia a análise completa de Israel França no Blog do Edison Silva."
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Sobre</h4>
              <p className="text-foreground/70 text-sm">
                Mobilização pela essência do PT. Denúncia sobre a mudança de rumo no Ceará.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.instagram.com/israelfranca" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                    @israelfranca
                  </a>
                </li>
                <li>
                  <a href="https://blogdoedisonsilva.com.br" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                    Blog do Edison Silva
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Mensagem</h4>
              <p className="text-foreground/70 text-sm italic">
                "A gente vai resgatar a nossa essência. Sua voz é a força que a estrela precisa pra brilhar de novo!"
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-foreground/40 text-xs uppercase tracking-widest font-bold">
            <p>Mobilização Política • PT Ceará • 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
