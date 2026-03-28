import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export default function MediaGallery() {
  const { data: media, isLoading } = trpc.gallery.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-red-900/10 animate-pulse rounded-lg border border-red-900/30"></div>
        ))}
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12 bg-red-900/10 rounded-lg border border-red-900/30 border-dashed">
        <p className="text-red-300">Nenhuma foto ou vídeo na galeria ainda.</p>
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    // Instagram Reels
    if (url.includes("instagram.com/reel/")) {
      const id = url.split("/reel/")[1].split("/")[0];
      return `https://www.instagram.com/reel/${id}/embed`;
    }
    return url;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-8">
      {media.map((item) => (
        <Card key={item.id} className="group overflow-hidden bg-red-950 border-red-800 hover:border-red-500 transition-all cursor-pointer">
          <div className="aspect-square relative">
            {item.type === "video" ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black/60">
                <iframe
                  src={getEmbedUrl(item.url)}
                  className="w-full h-full pointer-events-none group-hover:pointer-events-auto"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:hidden transition-all pointer-events-none">
                  <PlayCircle className="w-12 h-12 text-red-500" />
                </div>
              </div>
            ) : (
              <img 
                src={item.url} 
                alt={item.caption || ""} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
            )}
            
            {/* Caption on Hover */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                {item.type === "video" ? <PlayCircle className="w-4 h-4 text-red-400" /> : <ImageIcon className="w-4 h-4 text-red-400" />}
                <p className="text-xs text-white truncate font-medium">{item.caption || (item.type === "video" ? "Vídeo" : "Imagem")}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
