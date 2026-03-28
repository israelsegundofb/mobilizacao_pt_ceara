import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Blog() {
  const [page, setPage] = useState(0);
  const limit = 6;
  
  const { data: posts, isLoading } = trpc.blog.getPublished.useQuery({
    limit,
    offset: page * limit,
  });

  const hasMore = posts && posts.length === limit;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">⭐</span>
              </div>
              <span className="font-bold text-lg">A Estrela do PT</span>
            </a>
          </Link>
          <Link href="/">
            <a className="text-red-400 hover:text-red-300 transition-colors">Voltar</a>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">Blog</h1>
          <p className="text-xl text-red-200">
            Artigos, análises e reflexões sobre a luta política no Ceará
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-center text-red-200">Carregando posts...</p>
          ) : posts && posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <a className="group">
                      <Card className="bg-red-900/30 border-red-700/50 hover:border-red-500 transition-all h-full overflow-hidden cursor-pointer">
                        {/* Featured Image */}
                        {post.featuredImage && (
                          <div className="w-full h-48 bg-red-800 overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          {/* Category */}
                          <div className="inline-block px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full mb-4">
                            <span className="text-red-300 text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-red-300 transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-red-200 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="space-y-2 text-xs text-red-300 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{post.author}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.split(",").slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag.trim()}
                                  className="text-xs px-2 py-1 bg-red-700/30 text-red-300 rounded"
                                >
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
                            <span className="text-sm font-semibold">Ler mais</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  variant="outline"
                >
                  ← Anterior
                </Button>
                <span className="text-red-300">Página {page + 1}</span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMore}
                  variant="outline"
                >
                  Próxima →
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-red-900/30 border-red-700/50 p-12 text-center">
              <p className="text-red-200 mb-4">Nenhum post publicado ainda</p>
              <p className="text-red-300 text-sm">
                Volte em breve para novas análises e artigos
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900/30 py-12 px-4 mt-12">
        <div className="container max-w-5xl mx-auto text-center text-red-400 text-sm">
          <p>Mobilização Política • PT Ceará • 2026</p>
        </div>
      </footer>
    </div>
  );
}
