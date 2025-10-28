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
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Users } from "lucide-react";
import type { Project } from "@/types/project";
import { toast } from "sonner";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useUsers } from "@/hooks/useUser";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  project: Project;
};

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  manager: "Manager",
  contributor: "Contributeur",
  viewer: "Observateur",
};

export default function ProjectMembersModal({
  isOpen,
  onClose,
  project,
}: Props) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  const {
    data: members,
    loading: membersLoading,
    addMember,
    updateRole,
    removeMember,
    refetch,
  } = useProjectMembers(isOpen ? project.id : undefined);

  const { data: allUsers, loading: usersLoading } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("contributor");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, refetching members for project:", project.id);
      refetch();
    }
  }, [isOpen, refetch, project.id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filtrer les utilisateurs déjà membres directs du projet
  const availableUsers =
    allUsers?.filter(
      (user) =>
        !members.some(
          (member) => member.id === user.id && member.source === "project"
        )
    ) || [];

  const handleAddMember = async () => {
    console.log("handleAddMember called", { selectedUserId, selectedRole });

    if (!selectedUserId) {
      toast.error("Veuillez sélectionner un utilisateur");
      return;
    }

    setIsAdding(true);
    try {
      console.log(
        "Calling addMember with:",
        parseInt(selectedUserId),
        selectedRole
      );
      const success = await addMember(parseInt(selectedUserId), selectedRole);

      console.log("addMember result:", success);

      if (success) {
        toast.success("Membre ajouté avec succès");
        setSelectedUserId("");
        setSelectedRole("contributor");
      } else {
        toast.error("Échec de l'ajout du membre");
      }
    } catch (error: any) {
      console.error("Error in handleAddMember:", error);
      toast.error(error.message || "Erreur lors de l'ajout du membre");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce membre ?")) return;

    const success = await removeMember(userId);
    if (success) {
      toast.success("Membre retiré avec succès");
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    const success = await updateRole(userId, newRole);
    if (success) {
      toast.success("Rôle mis à jour avec succès");
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
            {t("project.members.title") || "Gérer les membres"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {project.name} - {members.length} membre(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ajouter un membre */}
          <div className="rounded-md border border-[var(--hover-border)] p-4">
            <h3 className="text-sm font-medium mb-3">
              {t("project.members.add") || "Ajouter un membre"}
            </h3>
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={(value) => {
                  console.log("User selected:", value);
                  setSelectedUserId(value);
                }}
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

              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  console.log("Role selected:", value);
                  setSelectedRole(value);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Observateur</SelectItem>
                  <SelectItem value="contributor">Contributeur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddMember}
                disabled={isAdding || !selectedUserId || membersLoading}
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
              {t("project.members.current") || "Membres actuels"}
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={`${member.id}-${member.source}`}
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
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{member.name}</p>
                            {member.source === "team" && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                Via team
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {member.source === "project" ? (
                          <>
                            <Select
                              value={member.role}
                              onValueChange={(role) =>
                                handleUpdateRole(member.id, role)
                              }
                              disabled={membersLoading}
                            >
                              <SelectTrigger className="w-[140px] h-8">
                                <SelectValue>
                                  {roleLabels[member.role] || member.role}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">
                                  Observateur
                                </SelectItem>
                                <SelectItem value="contributor">
                                  Contributeur
                                </SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">
                                  Administrateur
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="h-8">
                            {roleLabels[member.role] || member.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucun membre dans ce projet
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
