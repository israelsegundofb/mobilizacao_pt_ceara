import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, Share2, LogIn } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/_core/hooks/useAuth";

export default function BlogPost() {
  const { isAuthenticated } = useAuth();
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const handleShare = () => {
    const url = window.location.href;
    const text = `Leia: ${post?.title} - ${url}`;

    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 font-black uppercase tracking-widest text-xs opacity-40">Abrindo artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
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
            <Link href="/admin">
              <a className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-3 py-1.5 rounded-md transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                <LogIn className="w-3 h-3" />
                {isAuthenticated ? "Painel" : "Entrar"}
              </a>
            </Link>
          </div>
        </nav>

        <div className="container max-w-4xl mx-auto py-32 text-center">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Post não encontrado</h1>
          <p className="text-foreground/40 mb-12 font-medium">O conteúdo que você procura pode ter sido removido ou o link está incorreto.</p>
          <Link href="/blog">
            <a>
              <Button className="bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-full shadow-lg">Retornar ao Blog</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/blog">
            <a className="text-white/80 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">← Voltar</a>
          </Link>
          <Link href="/admin">
            <a className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-3 py-1.5 rounded-md transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
              <LogIn className="w-3 h-3" />
              {isAuthenticated ? "Painel" : "Entrar"}
            </a>
          </Link>
        </div>
      </nav>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full h-[500px] bg-secondary overflow-hidden border-b border-border">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="py-20 px-4">
        <div className="container max-w-3xl mx-auto">
          {/* Category */}
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter uppercase text-foreground">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-12 pb-12 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Data pendente"}
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-border pl-6">
              <User className="w-4 h-4 text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 border-l border-border pl-6">
              <span>{post.views} visualizações</span>
            </div>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="ml-auto hover:bg-secondary/50 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar
            </Button>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-red max-w-none mb-20 text-foreground/80 leading-relaxed font-serif">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 py-10 border-t border-border mb-12">
              {post.tags.split(",").map((tag: string) => (
                <Link key={tag.trim()} href={`/blog?tag=${encodeURIComponent(tag.trim())}`}>
                  <a className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-primary/10 hover:text-primary text-[10px] font-black uppercase tracking-widest rounded-full transition-all border border-border">
                    <Tag className="w-3 h-3" />
                    {tag.trim()}
                  </a>
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio */}
          <div className="bg-secondary/20 border border-border rounded-2xl p-8 mb-20">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-black text-2xl">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-black uppercase tracking-tight text-xl mb-2">{post.author}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed max-w-md">
                  Voz ativa na defesa dos direitos sociais e na reconstrução do PT Ceará. Autor de análises críticas e mobilização popular.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white p-2 rounded-2xl">
            <CommentSection postId={post.id} />
          </div>

          {/* Related Posts */}
          <div className="mt-24 pt-16 border-t border-border flex flex-col items-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Quer ler mais?</h2>
            <Link href="/blog">
              <a>
                <Button className="bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs px-10 py-8 rounded-full shadow-xl">
                  Explorar todos os artigos
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Mobilização Política • PT Ceará • 2026</p>
        </div>
      </footer>
    </div>
  );
}
