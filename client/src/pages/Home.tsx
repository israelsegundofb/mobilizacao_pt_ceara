import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Heart, Users, AlertCircle, Share2 } from "lucide-react";
import { useState } from "react";
import PetitionSignForm from "@/components/PetitionSignForm";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⭐</span>
            </div>
            <span className="font-bold text-lg">A Estrela do PT</span>
          </div>
          <a 
            href="https://blogdoedisonsilva.com.br/2026/03/26/a-agonia-da-estrela-o-pt-do-ceara-a-traicao-estatutaria-e-o-silenciamento-de-nossas-mulheres/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            Leia o Artigo Completo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-full">
            <p className="text-red-300 text-sm font-semibold">🔴 DENÚNCIA POLÍTICA</p>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            O PT TÁ MUDANDO DE LADO NO CEARÁ?
          </h1>
          
          <p className="text-xl md:text-2xl text-red-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Mulheres da luta estão sendo silenciadas. A estrela vermelha virou balcão de negócios. 
            <span className="block mt-4 font-bold text-red-400">É hora de falar a verdade.</span>
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
      <section className="py-16 px-4 bg-black/50">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">A Verdade Que Ninguém Quer Ouvir</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "mulheres" ? null : "mulheres")}
              className="bg-red-900/30 border-red-700/50 hover:border-red-500 cursor-pointer transition-all p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center group-hover:bg-red-600/50 transition-colors">
                  <Users className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Nossas Mulheres Estão Sendo Caladas</h3>
              </div>
              <p className="text-red-200 leading-relaxed">
                Luizianne Lins e Larissa Gaspar, que construíram o PT no suor e na luta, hoje tão sendo deixadas de lado. É uma vergonha o que tão fazendo com elas.
              </p>
            </Card>

            {/* Card 2 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "coroneis" ? null : "coroneis")}
              className="bg-red-900/30 border-red-700/50 hover:border-red-500 cursor-pointer transition-all p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center group-hover:bg-red-600/50 transition-colors">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Os Coronéis Tão Voltando</h3>
              </div>
              <p className="text-red-200 leading-relaxed">
                Em nome de uma tal de "governabilidade", tão abrindo as portas do PT pra quem sempre foi contra a gente. Pra quem sempre defendeu os ricos e poderosos.
              </p>
            </Card>

            {/* Card 3 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "estrela" ? null : "estrela")}
              className="bg-red-900/30 border-red-700/50 hover:border-red-500 cursor-pointer transition-all p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center group-hover:bg-red-600/50 transition-colors">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">A Estrela Não É Balcão de Negócios</h3>
              </div>
              <p className="text-red-200 leading-relaxed">
                Essa "união" que eles falam é só pra trazer mais gente da direita pra dentro do partido. Tão transformando a nossa estrela vermelha num balcão de negócios pra oligarquia.
              </p>
            </Card>

            {/* Card 4 */}
            <Card 
              onClick={() => setActiveSection(activeSection === "luta" ? null : "luta")}
              className="bg-red-900/30 border-red-700/50 hover:border-red-500 cursor-pointer transition-all p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center group-hover:bg-red-600/50 transition-colors">
                  <Share2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Mas a Gente Não Vai Deixar</h3>
              </div>
              <p className="text-red-200 leading-relaxed">
                O PT é do povo, é da luta! E a gente vai resgatar a nossa essência. Sua voz é a força que a estrela precisa pra brilhar de novo!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">O Que Está Acontecendo</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-black text-red-500 mb-2">100%</div>
              <p className="text-red-200 font-semibold">Dos Princípios Estatutários Violados</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-black text-red-500 mb-2">∞</div>
              <p className="text-red-200 font-semibold">Silenciamento de Mulheres Combativas</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-black text-red-500 mb-2">0</div>
              <p className="text-red-200 font-semibold">Governabilidade Sem Traição</p>
            </div>
          </div>
        </div>
      </section>

      {/* Petition Sign Form Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Manifeste Seu Apoio</h2>
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
      <footer className="bg-black border-t border-red-900/30 py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-red-400 mb-4">Sobre</h4>
              <p className="text-red-200 text-sm">
                Mobilização pela essência do PT. Denúncia sobre a mudança de rumo no Ceará.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-red-400 mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.instagram.com/israelfranca" target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-400 transition-colors">
                    @israelfranca
                  </a>
                </li>
                <li>
                  <a href="https://blogdoedisonsilva.com.br" target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-400 transition-colors">
                    Blog do Edison Silva
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-red-400 mb-4">Mensagem</h4>
              <p className="text-red-200 text-sm">
                "A gente vai resgatar a nossa essência. Sua voz é a força que a estrela precisa pra brilhar de novo!"
              </p>
            </div>
          </div>

          <div className="border-t border-red-900/30 pt-8 text-center text-red-400 text-sm">
            <p>Mobilização Política • PT Ceará • 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
