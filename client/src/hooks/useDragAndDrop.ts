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
import { useQuickUpdateIssue } from "./useQuickUpdateIssue";
import { toast } from "sonner";

export function useDragAndDrop(
  tasks: Task[],
  onTasksUpdate: (tasks: Task[]) => void,
  onRefreshData?: () => void
) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { updateTaskStatus, isUpdating } = useQuickUpdateIssue();

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
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;

    // Trouver la tâche déplacée
    const draggedTask = tasks.find((task) => task.id === activeTaskId);
    if (!draggedTask) return;

    // Mapper les colonnes vers les statuts
    const statusMapping: Record<string, TaskStatus> = {
      todo: "todo",
      "in-progress": "in-progress",
      done: "done",
    };

    const newStatus = statusMapping[overColumnId];
    if (!newStatus || draggedTask.status === newStatus) return;

    // Mise à jour optimiste de l'interface
    const updatedTasks = tasks.map((task) =>
      task.id === activeTaskId ? { ...task, status: newStatus } : task
    );
    onTasksUpdate(updatedTasks);

    try {
      const statusKeyMapping: Record<TaskStatus, string> = {
        todo: "TODO",
        "in-progress": "IN_PROGRESS",
        done: "DONE",
      };

      const statusKey = statusKeyMapping[newStatus];

      const result = await updateTaskStatus(draggedTask, statusKey);

      if (result) {
        toast.success("Statut de la tâche mis à jour");

        if (onRefreshData) {
          onRefreshData();
        }
      } else {
        onTasksUpdate(tasks);
      }
    } catch (error) {
      onTasksUpdate(tasks);
      toast.error("Erreur lors de la mise à jour du statut");
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
