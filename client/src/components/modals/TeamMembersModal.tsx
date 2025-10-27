import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Trash2 } from "lucide-react";
import type { Team } from "@/types/team";
import { toast } from "sonner";
import { teamService } from "@/api/services/teamService";
import { useUsers } from "@/hooks/useUser";
import { useTeam } from "@/hooks/useTeam";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  team: Team;
  onMemberAdded?: () => void;
  onMemberRemoved?: () => void;
};

const roleLabels: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  member: "Membre",
  viewer: "Observateur",
};

export default function TeamMembersModal({
  isOpen,
  onClose,
  team: initialTeam,
  onMemberAdded,
  onMemberRemoved,
}: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // Récupérer les données à jour de la team
  const { data: teamData, refetch: refetchTeam } = useTeam(
    isOpen ? initialTeam.id : undefined
  );

  // Utiliser les données à jour ou les données initiales
  const team = teamData || initialTeam;

  // Récupérer tous les utilisateurs disponibles
  const { data: allUsers, loading: usersLoading } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Recharger la team quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      refetchTeam();
    }
  }, [isOpen, refetchTeam]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filtrer les utilisateurs qui ne sont pas déjà membres
  const availableUsers =
    allUsers?.filter(
      (user) => !team.members?.some((member) => member.id === user.id)
    ) || [];

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Veuillez sélectionner un utilisateur");
      return;
    }

    setIsAdding(true);
    try {
      await teamService.addMember(
        team.id,
        parseInt(selectedUserId),
        selectedRole
      );

      toast.success("Membre ajouté avec succès");
      setSelectedUserId("");
      setSelectedRole("member");

      // Recharger les données de la team
      await refetchTeam();

      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout du membre");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce membre ?")) return;

    try {
      await teamService.removeMember(team.id, userId);

      toast.success("Membre retiré avec succès");

      // Recharger les données de la team
      await refetchTeam();

      if (onMemberRemoved) onMemberRemoved();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du retrait du membre");
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    setIsUpdating(true);
    try {
      await teamService.updateMemberRole(team.id, userId, newRole);

      toast.success("Rôle mis à jour avec succès");

      // Recharger les données de la team
      await refetchTeam();

      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du rôle");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[700px] w-[90vw] max-h-[80vh] overflow-hidden border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {t("team.members.title") || "Gérer les membres"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {team.name} - {team.members?.length || 0} membre(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ajouter un membre */}
          <div className="rounded-md border border-[var(--hover-border)] p-4">
            <h3 className="text-sm font-medium mb-3">
              {t("team.members.add") || "Ajouter un membre"}
            </h3>
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={usersLoading || availableUsers.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      usersLoading
                        ? "Chargement..."
                        : availableUsers.length === 0
                        ? "Aucun utilisateur disponible"
                        : "Sélectionner un utilisateur"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Observateur</SelectItem>
                  <SelectItem value="member">Membre</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddMember}
                disabled={isAdding || !selectedUserId}
                className={cn(`theme-${colorTheme}`)}
              >
                {isAdding ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Liste des membres */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              {t("team.members.current") || "Membres actuels"}
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-md border border-[var(--hover-border)] hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              member.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                            }
                          />
                          <AvatarFallback>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={member.pivot.role}
                          onValueChange={(role) =>
                            handleUpdateRole(member.id, role)
                          }
                          disabled={member.pivot.role === "owner" || isUpdating}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue>
                              {roleLabels[member.pivot.role] ||
                                member.pivot.role}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Observateur</SelectItem>
                            <SelectItem value="member">Membre</SelectItem>
                            <SelectItem value="admin">
                              Administrateur
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {member.pivot.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucun membre dans cette équipe
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onClose(false)}>
            {t("common.close") || "Fermer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
