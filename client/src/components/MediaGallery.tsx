import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export default function MediaGallery() {
  const { data: media, isLoading } = trpc.gallery.getAll.useQuery();

   if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-secondary/50 animate-pulse rounded-xl border border-border"></div>
        ))}
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-16 bg-secondary/20 rounded-xl border-2 border-dashed border-border">
        <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">Nenhum registro na galeria ainda.</p>
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
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
      {media.map((item) => (
        <Card key={item.id} className="group overflow-hidden bg-white border border-border hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-xl rounded-xl">
          <div className="aspect-square relative flex items-center justify-center bg-secondary/10">
            {item.type === "video" ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                <iframe
                  src={getEmbedUrl(item.url)}
                  title={item.caption || "Vídeo da galeria"}
                  className="w-full h-full pointer-events-none group-hover:pointer-events-auto"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:hidden transition-all pointer-events-none">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
            ) : (
              <img 
                src={item.url} 
                alt={item.caption || "Imagem da galeria"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            )}
            
            {/* Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                {item.type === "video" ? <PlayCircle className="w-4 h-4 text-white" /> : <ImageIcon className="w-4 h-4 text-white" />}
                <p className="text-xs text-white truncate font-black uppercase tracking-wider">{item.caption || (item.type === "video" ? "Vídeo Resistance" : "Foto da Luta")}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
