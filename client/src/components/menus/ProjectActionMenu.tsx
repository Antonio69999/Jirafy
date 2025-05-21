import { MoreHorizontal, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";



interface ProjectActionMenuProps {
  projectId: string;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectActionMenu({
  projectId,
  onArchive,
  onDelete,
}: ProjectActionMenuProps) {
  const { t } = useTranslation();

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
          onClick={() => onArchive && onArchive(projectId)}
          className="cursor-pointer"
        >
          <Archive className="mr-2 h-4 w-4" />
          <span>{t("project.actions.archive") || "Archive"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete && onDelete(projectId)}
          className="text-destructive cursor-pointer focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>{t("project.actions.delete") || "Move to trash"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
