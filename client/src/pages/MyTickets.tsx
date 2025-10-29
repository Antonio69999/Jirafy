import { useTranslation } from "react-i18next";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/pages/PageContainer";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Import du hook à créer
// import { useMyTickets } from "@/hooks/useMyTickets";

export default function MyTickets() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // État temporaire (en attendant le vrai hook)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // TODO: Récupérer les tickets du client via API
  // const { data: tickets, loading, error } = useMyTickets();

  // Données mockées pour l'instant
  const tickets: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-blue-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "DONE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "LOW":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <PageContainer title={t("customer.myTickets.title") || "Mes Tickets"}>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {t("customer.myTickets.description") ||
            "Consultez et gérez vos demandes de support."}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {t("customer.myTickets.title") || "Mes Tickets"}
        </h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className={cn(
            "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
            `theme-${colorTheme}`
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("customer.myTickets.create") || "Créer un ticket"}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-18rem)]">
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={cn(
                  "border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer",
                  `theme-${colorTheme} hover:border-[var(--hover-border)]`
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{ticket.title}</h3>
                      <Badge
                        className={cn("text-xs", getStatusColor(ticket.status))}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      getPriorityColor(ticket.priority)
                    )}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Créé le {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    {ticket.assignee && (
                      <span>Assigné à {ticket.assignee.name}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {ticket.comments_count || 0} commentaires
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t("customer.myTickets.empty") || "Aucun ticket pour le moment"}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("customer.myTickets.createFirst") ||
                  "Créer votre premier ticket"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* TODO: Ajouter la modale de création de ticket */}
      {/* <CreateTicketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      /> */}
    </PageContainer>
  );
}
