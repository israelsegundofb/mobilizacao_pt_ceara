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
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-red-900/30 hidden md:block"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => (
          <div key={event.id} className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            {/* Content Sidebar */}
            <div className="w-full md:w-5/12 hidden md:block"></div>
            
            {/* Dot */}
            <div className="z-10 bg-red-600 w-4 h-4 rounded-full border-4 border-black mb-4 md:mb-0"></div>
            
            {/* Card Content */}
            <Card className="w-full md:w-5/12 bg-red-900/20 border-red-700/50 p-6 hover:border-red-500 transition-all">
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.eventDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-red-200 text-sm leading-relaxed">
                {event.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
