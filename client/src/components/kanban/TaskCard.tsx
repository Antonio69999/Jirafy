import { useState } from "react";
import { cn } from "@/lib/utils";
import { type Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MoreHorizontal } from "lucide-react";
import { EditTaskModal } from "@/components/modals/EditTaskModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TaskCardProps {
  task: Task;
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
  onTaskUpdate?: () => void;
}

export function TaskCard({
  task,
  colorTheme,
  getPriorityClass,
  onTaskUpdate,
}: TaskCardProps) {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-background rounded-lg border p-3 mb-2 shadow-sm",
          "hover:shadow-md transition-shadow cursor-pointer",
          `theme-${colorTheme}`
        )}
        onClick={handleEditClick}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick();
                }}
              >
                {t("task.actions.edit") || "Modifier"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implémenter la suppression
                }}
              >
                {t("task.actions.delete") || "Supprimer"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                getPriorityClass(task.priority)
              )}
            />
            <span className="text-xs text-muted-foreground">{task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.slice(0, 3).map((label, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-1 py-0"
              >
                {label}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      <EditTaskModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        colorTheme={colorTheme}
      />
    </>
  );
}
