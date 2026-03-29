import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Timeline() {
  const { data: events, isLoading } = trpc.timeline.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="relative py-12">
      {/* Central Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => (
          <div key={event.id} className={`flex flex-col md:flex-row items-center justify-between w-full relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            {/* Content Sidebar */}
            <div className="w-full md:w-5/12 hidden md:block"></div>
            
            {/* Dot */}
            <div className="z-10 bg-primary w-5 h-5 rounded-full border-4 border-white shadow-sm mb-4 md:mb-0 transition-transform hover:scale-125"></div>
            
            {/* Card Content */}
            <Card className="w-full md:w-5/12 bg-white border border-border p-8 hover:border-primary/50 transition-all shadow-sm hover:shadow-md rounded-xl">
              <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-3">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.eventDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 leading-tight tracking-tight uppercase">{event.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {event.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
