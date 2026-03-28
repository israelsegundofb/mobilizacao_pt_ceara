import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, Share2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export default function BlogPost() {
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
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white flex items-center justify-center">
        <p>Carregando post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white">
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
          </div>
        </nav>

        <div className="container max-w-4xl mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
          <p className="text-red-200 mb-8">O post que você está procurando não existe.</p>
          <Link href="/blog">
            <a>
              <Button className="bg-red-600 hover:bg-red-700">Voltar ao Blog</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/blog">
            <a className="text-red-400 hover:text-red-300 transition-colors">← Blog</a>
          </Link>
        </div>
      </nav>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full h-96 bg-red-800 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          {/* Category */}
          <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-full mb-6">
            <span className="text-red-300 text-sm font-semibold">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-red-300 mb-8 pb-8 border-b border-red-900/30">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Data desconhecida"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👁️ {post.views} visualizações</span>
            </div>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-3 py-8 border-t border-red-900/30">
              {post.tags.split(",").map((tag: string) => (
                <Link key={tag.trim()} href={`/blog?tag=${encodeURIComponent(tag.trim())}`}>
                  <a className="inline-flex items-center gap-2 px-4 py-2 bg-red-700/30 hover:bg-red-700/50 text-red-300 rounded-full transition-colors">
                    <Tag className="w-4 h-4" />
                    {tag.trim()}
                  </a>
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio */}
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-6 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{post.author}</h3>
                <p className="text-red-200 text-sm">
                  Autor de artigos sobre política e mobilização no Ceará
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16 pt-12 border-t border-red-900/30">
            <h2 className="text-2xl font-bold mb-6">Leia também</h2>
            <Link href="/blog">
              <a>
                <Button className="bg-red-600 hover:bg-red-700">
                  Voltar ao Blog
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900/30 py-12 px-4">
        <div className="container max-w-5xl mx-auto text-center text-red-400 text-sm">
          <p>Mobilização Política • PT Ceará • 2026</p>
        </div>
      </footer>
    </div>
  );
}
