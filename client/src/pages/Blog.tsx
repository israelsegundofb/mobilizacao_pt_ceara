import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Tag, LogIn } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Blog() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const limit = 6;
  
  const { data: posts, isLoading } = trpc.blog.getPublished.useQuery({
    limit,
    offset: page * limit,
  });

  const hasMore = posts && posts.length === limit;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">⭐</span>
              </div>
              <span className="font-black uppercase tracking-tight text-lg">Blog da Luta</span>
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="text-white/80 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Voltar</a>
            </Link>
            <Link href="/admin">
              <a className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-3 py-1.5 rounded-md transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                <LogIn className="w-3 h-3" />
                {isAuthenticated ? "Painel" : "Entrar"}
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 px-4 bg-secondary/20 border-b border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">Artigos & Análises</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Reflexões profundas sobre a reconstrução do Partido dos Trabalhadores no Ceará e a nossa mobilização direta.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-foreground/40 font-black uppercase tracking-widest text-xs">Carregando conteúdo...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <a className="group">
                      <Card className="bg-white border border-border hover:border-primary transition-all h-full overflow-hidden cursor-pointer shadow-sm hover:shadow-xl rounded-2xl">
                        {/* Featured Image */}
                        {post.featuredImage && (
                          <div className="w-full h-56 bg-secondary overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-8">
                          {/* Category */}
                          <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
                            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                              {post.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-black mb-4 line-clamp-2 leading-tight tracking-tight uppercase group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {/* Meta */}
                          <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/40 mb-4 uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-border pl-4">
                              <User className="w-3.5 h-3.5" />
                              <span>{post.author}</span>
                            </div>
                          </div>

                          {/* Excerpt */}
                          <p className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Action */}
                          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                            <span className="text-xs font-black uppercase tracking-widest">Continuar lendo</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-6">
                <Button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  variant="outline"
                  className="rounded-full px-6 uppercase font-black text-[10px] tracking-widest border-border hover:border-primary"
                >
                  ← Anterior
                </Button>
                <span className="text-xs font-black uppercase tracking-widest text-foreground/40">Página {page + 1}</span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMore}
                  variant="outline"
                  className="rounded-full px-6 uppercase font-black text-[10px] tracking-widest border-border hover:border-primary"
                >
                  Próxima →
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-secondary/10 border-2 border-dashed border-border p-20 text-center rounded-3xl">
              <p className="text-foreground/60 text-xl font-bold mb-2">Nenhum post publicado ainda</p>
              <p className="text-foreground/40 text-sm uppercase font-black tracking-widest">
                Volte em breve para novas reflexões
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-16 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Mobilização Política • PT Ceará • 2026</p>
        </div>
      </footer>
    </div>
  );
}
