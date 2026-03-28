import { useEffect, useState } from "react";
import { Heart, MessageCircle, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Usar tRPC para buscar o feed
  const { data: feedData, isLoading: isFeedLoading, refetch } = trpc.instagram.getFeed.useQuery();

  useEffect(() => {
    if (feedData && feedData.length > 0) {
      setPosts(feedData as InstagramPost[]);
      setLastUpdate(new Date());
    }
  }, [feedData]);

  // Atualizar feed a cada 5 minutos automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [refetch]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return "Nunca";
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "Agora";
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  if (isFeedLoading && posts.length === 0) {
    return (
      <section className="py-16 px-4 bg-black/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Acompanhe @israelfranca</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-black/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black">Acompanhe @israelfranca</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Atualizado {formatLastUpdate(lastUpdate)}
            </span>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Atualizar feed"
            >
              <RefreshCw 
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`https://www.instagram.com/p/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900 hover:shadow-lg transition-all duration-300"
              >
                {/* Imagem */}
                <img
                  src={post.media_url}
                  alt={post.caption || "Post do Instagram"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      <span>{post.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                  
                  {post.caption && (
                    <p className="text-white text-xs mt-2 line-clamp-2">{post.caption}</p>
                  )}
                </div>

                {/* Badge de tipo de mídia */}
                {post.media_type === "VIDEO" && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1 text-white text-xs font-semibold">
                    ▶ Vídeo
                  </div>
                )}
                {post.media_type === "CAROUSEL" && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1 text-white text-xs font-semibold">
                    📸 Carrossel
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Nenhum post encontrado. Configure as credenciais do Instagram para exibir o feed.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/israelfranca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
