import { MoreHorizontal, Trash2, Archive, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useDeleteProject } from "@/hooks/useProject";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectActionMenuProps {
  projectId: string;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ProjectActionMenu({
  projectId,
  onArchive,
  onDelete,
  onEdit,
}: ProjectActionMenuProps) {
  const { t } = useTranslation();
  const { remove, loading } = useDeleteProject();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(projectId);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || loading) return;

    const confirmed = window.confirm(
      t("project.actions.deleteConfirm") || 
      "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const success = await remove(Number(projectId));
      if (success) {
        toast.success(
          t("project.actions.deleteSuccess") || "Projet supprimé avec succès"
        );
        if (onDelete) {
          onDelete(projectId);
        }
      }
    } catch (error) {
      toast.error(
        t("project.actions.deleteError") || "Erreur lors de la suppression du projet"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(projectId);
      // Pour l'instant, juste un toast d'information
      toast.info(
        t("project.actions.archiveNotImplemented") || 
        "L'archivage sera bientôt disponible"
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleEdit}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>{t("project.actions.edit") || "Modifier"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleArchive}
          className="cursor-pointer"
        >
          <Archive className="mr-2 h-4 w-4" />
          <span>{t("project.actions.archive") || "Archive"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isDeleting || loading}
          className="text-destructive cursor-pointer focus:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>
            {isDeleting 
              ? (t("project.actions.deleting") || "Suppression...") 
              : (t("project.actions.delete") || "Move to trash")
            }
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}