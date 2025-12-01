import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { type Task, type TaskStatus } from "@/types/task";
import { issueService } from "@/api/services/issueService";
import { toast } from "sonner";

export function useDragAndDrop(
  tasks: Task[],
  onTasksUpdate: (tasks: Task[]) => void,
  onRefreshData?: () => void
) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // Ajout de l'état manquant

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveTask(null);
      return;
    }

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    setIsUpdating(true);

    try {
      // Extraire l'ID du statut depuis newStatus ("status-123" -> 123)
      const statusId = parseInt(newStatus.replace("status-", ""));

      // Récupérer l'issue par sa clé
      const issue = await issueService.getByKey(taskId);

      // Mettre à jour le statut
      await issueService.update(issue.id, {
        status_id: statusId,
      });

      toast.success("Tâche déplacée avec succès");

      // Rafraîchir les données
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du déplacement de la tâche");
    } finally {
      setIsUpdating(false);
      setActiveTask(null);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return {
    sensors,
    activeTask,
    isUpdating,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    DndContext,
    DragOverlay,
    closestCorners,
  };
}
