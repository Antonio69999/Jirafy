import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/kanban/TaskCard";
import { type Task, type TaskStatus } from "@/types/task";
import { Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface KanbanViewProps {
  tasks: Task[];
  columns: { id: string; title: string }[];
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
  editingColumn: string | null;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  handleAddTask: (columnId: string) => void;
  handleCancelAdd: () => void;
  handleSaveTask: (columnId: string, title: string) => Promise<void>;
  onTaskSuccess?: () => void;
  onTasksUpdate?: (tasks: Task[]) => void;
  onRefreshData?: () => void;
  isCreatingTask?: boolean;
}

// Composant pour la zone de drop des colonnes
function DroppableColumn({
  id,
  title,
  tasks,
  colorTheme,
  getPriorityClass,
  editingColumn,
  newTaskTitle,
  setNewTaskTitle,
  handleAddTask,
  handleCancelAdd,
  handleSaveTask,
  onTaskUpdate,
  isCreatingTask,
}: {
  id: string;
  title: string;
  tasks: Task[];
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
  editingColumn: string | null;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  handleAddTask: (columnId: string) => void;
  handleCancelAdd: () => void;
  handleSaveTask: (columnId: string, title: string) => Promise<void>;
  onTaskUpdate: () => void;
  isCreatingTask: boolean;
}) {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({ id });

  const handleSaveClick = async () => {
    if (newTaskTitle.trim() === "") {
      handleCancelAdd();
      return;
    }
    await handleSaveTask(id, newTaskTitle.trim());
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-card rounded-md border shadow-sm flex flex-col h-full w-[280px] flex-shrink-0",
        isOver && "ring-2 ring-[var(--primary)]/50"
      )}
    >
      <div className="p-2 border-b flex justify-between items-center sticky top-0 bg-card z-10">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="bg-muted text-muted-foreground text-xs font-medium rounded-full px-1.5 py-0.5">
          {tasks.length}
        </div>
      </div>

      <ScrollArea className="flex-1 p-1.5">
        {/* Tâches existantes */}
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            colorTheme={colorTheme}
            getPriorityClass={getPriorityClass}
            onTaskUpdate={onTaskUpdate}
          />
        ))}

        {editingColumn === id ? (
          <div className="mt-1.5 border rounded-md overflow-hidden">
            <textarea
              className="w-full p-2 text-sm resize-none focus:outline-none"
              placeholder={
                t("dashboard.addTask.titlePlaceholder") || "Que faut-il faire?"
              }
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
              rows={2}
              disabled={isCreatingTask}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isCreatingTask) {
                    handleSaveClick();
                  }
                } else if (e.key === "Escape") {
                  if (!isCreatingTask) {
                    handleCancelAdd();
                  }
                }
              }}
            />
            <div className="flex justify-end p-2 bg-muted/30 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAdd}
                className="h-7 px-2 text-xs"
                disabled={isCreatingTask}
              >
                {t("dashboard.addTask.cancel") || "Annuler"}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveClick}
                className={cn("h-7 px-3 text-xs ml-1", `theme-${colorTheme}`)}
                disabled={isCreatingTask || !newTaskTitle.trim()}
              >
                {isCreatingTask ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    {t("dashboard.addTask.creating") || "Création..."}
                  </>
                ) : (
                  t("dashboard.addTask.create") || "Ajouter"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <button
            className={cn(
              "w-full p-2 border-2 border-dashed rounded-md mt-1.5",
              "flex items-center justify-center gap-1.5",
              "text-xs text-muted-foreground hover:text-foreground",
              "hover:border-[var(--primary)] hover:bg-muted/30 transition-colors",
              `theme-${colorTheme}`
            )}
            onClick={() => handleAddTask(id)}
            disabled={isCreatingTask}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("dashboard.addTask.title") || "Add Task"}
          </button>
        )}
      </ScrollArea>
    </div>
  );
}

// Composant pour les tâches draggables
function DraggableTaskCard({
  task,
  colorTheme,
  getPriorityClass,
  onTaskUpdate,
}: {
  task: Task;
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
  onTaskUpdate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard
        task={task}
        colorTheme={colorTheme}
        getPriorityClass={getPriorityClass}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  );
}

export function KanbanView({
  tasks,
  columns,
  colorTheme,
  getPriorityClass,
  editingColumn,
  newTaskTitle,
  setNewTaskTitle,
  handleAddTask,
  handleCancelAdd,
  onTaskSuccess,
  handleSaveTask,
  onTasksUpdate,
  onRefreshData,
  isCreatingTask = false,
}: KanbanViewProps) {
  const { t } = useTranslation();

  const {
    sensors,
    activeTask,
    isUpdating,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    DndContext,
    DragOverlay,
    closestCorners,
  } = useDragAndDrop(tasks, onTasksUpdate || (() => {}), onRefreshData);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleTaskUpdate = () => {
    if (onTaskSuccess) {
      onTaskSuccess();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 px-1 pb-3 overflow-auto">
        <div className="flex gap-3 min-w-fit pb-1">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id as TaskStatus)}
              colorTheme={colorTheme}
              getPriorityClass={getPriorityClass}
              editingColumn={editingColumn}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              handleAddTask={handleAddTask}
              handleCancelAdd={handleCancelAdd}
              handleSaveTask={handleSaveTask}
              onTaskUpdate={handleTaskUpdate}
              isCreatingTask={isCreatingTask || isUpdating}
            />
          ))}
        </div>

        {/* Overlay pour l'élément en cours de drag */}
        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 opacity-90">
              <TaskCard
                task={activeTask}
                colorTheme={colorTheme}
                getPriorityClass={getPriorityClass}
                onTaskUpdate={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
