import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { MoreVertical, Calendar, Tag, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import { useDeleteIssue } from "@/hooks/useIssue";
import { useProjectStatuses } from "@/hooks/useStatus";
import { useIssueTransitions, usePerformTransition } from "@/hooks/useWorkflow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TransitionSelector } from "./TransitionSelector";
import { EditTaskModal } from "@/components/modals/EditTaskModal";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  const { remove: deleteIssue, loading: deleteLoading } = useDeleteIssue();

  const issueId = task.issueId || parseInt(task.id.split("-")[1]) || null;

  console.log("🔍 TaskCard issueId:", issueId, "for task:", task.id);

  const {
    data: transitions,
    loading: transitionsLoading,
    refetch: refetchTransitions,
  } = useIssueTransitions(issueId);

  const { performTransition, loading: isTransitioning } =
    usePerformTransition();

  const { data: projectStatuses } = useProjectStatuses(
    projectId ? parseInt(projectId) : null
  );

  // NOUVEAU : Recharger les transitions quand on affiche le sélecteur
  useEffect(() => {
    if (showTransitions && issueId) {
      console.log("🔄 Refetching transitions for issue:", issueId);
      refetchTransitions();
    }
  }, [showTransitions, issueId]);

  const getCurrentStatusName = (): string => {
    if (!projectStatuses || projectStatuses.length === 0) {
      return task.status;
    }

    const currentStatus = projectStatuses.find(
      (s) => `status-${s.id}` === task.status
    );
    return currentStatus?.name || task.status;
  };

  const handleTransition = async (transitionId: number) => {
    if (!issueId) return;

    try {
      await performTransition(issueId, transitionId);
      setShowTransitions(false);
      onTaskUpdate?.();
    } catch (error) {}
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onTaskUpdate?.();
  };

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await deleteIssue(task.id);
      onTaskUpdate?.();
    } finally {
      setIsDeleting(false);
    }
  };

  const isProcessing = isDeleting || deleteLoading;

  return (
    <>
      <div
        className={cn(
          "group p-3 bg-card rounded-lg border border-border hover:border-[var(--primary)] transition-all cursor-pointer",
          `theme-${colorTheme}`,
          isProcessing && "opacity-50 pointer-events-none"
        )}
      >
        {/* En-tête avec titre et menu */}
        <div className="flex items-start justify-between mb-2">
          <h4
            className="text-sm font-medium flex-1 mr-2"
            onClick={handleEditClick}
          >
            {task.title}
          </h4>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                {t("task.actions.edit") || "Modifier"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowTransitions(!showTransitions)}
              >
                Changer le statut
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("task.actions.delete") || "Supprimer"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description (si présente) */}
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        {showTransitions && issueId && (
          <div className="mb-3 p-3 bg-muted/50 rounded-md">
            <TransitionSelector
              issueId={issueId}
              currentStatusName={getCurrentStatusName()}
              transitions={transitions || []}
              onTransition={handleTransition}
              loading={transitionsLoading || isTransitioning}
              colorTheme={colorTheme}
            />
          </div>
        )}

        {/* Métadonnées */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.priority && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium text-white",
                getPriorityClass(task.priority)
              )}
            >
              {task.priority}
            </span>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.labels && task.labels.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{task.labels.length}</span>
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center gap-1 ml-auto">
              <User className="h-3 w-3" />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'édition */}
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
