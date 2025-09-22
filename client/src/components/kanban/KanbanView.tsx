import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/kanban/TaskCard";
import { type Task, type TaskStatus } from "@/types/task";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  handleSaveTask: (columnId: string) => void;
  onTaskSuccess?: () => void;
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
  handleSaveTask,
}: KanbanViewProps) {
  const { t } = useTranslation();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex-1 px-1 pb-3 overflow-auto">
      <div className="flex gap-3 min-w-fit pb-1">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-card rounded-md border shadow-sm flex flex-col h-full w-[280px] flex-shrink-0"
          >
            <div className="p-2 border-b flex justify-between items-center sticky top-0 bg-card z-10">
              <h3 className="font-medium text-sm">{column.title}</h3>
              <div className="bg-muted text-muted-foreground text-xs font-medium rounded-full px-1.5 py-0.5">
                {getTasksByStatus(column.id as TaskStatus).length}
              </div>
            </div>

            <ScrollArea className="flex-1 p-1.5">
              {/* Tâches existantes */}
              {getTasksByStatus(column.id as TaskStatus).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  colorTheme={colorTheme}
                  getPriorityClass={getPriorityClass}
                />
              ))}

              {editingColumn === column.id ? (
                <div className="mt-1.5 border rounded-md overflow-hidden">
                  <textarea
                    className="w-full p-2 text-sm resize-none focus:outline-none"
                    placeholder={
                      t("dashboard.addTask.titlePlaceholder") ||
                      "Que faut-il faire?"
                    }
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveTask(column.id);
                      } else if (e.key === "Escape") {
                        handleCancelAdd();
                      }
                    }}
                  />
                  <div className="flex justify-end p-2 bg-muted/30 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelAdd}
                      className="h-7 px-2 text-xs"
                    >
                      {t("dashboard.addTask.cancel") || "Annuler"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveTask(column.id)}
                      className={cn(
                        "h-7 px-3 text-xs ml-1",
                        `theme-${colorTheme}`
                      )}
                    >
                      {t("dashboard.addTask.create") || "Ajouter"}
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
                  onClick={() => handleAddTask(column.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("dashboard.addTask.title") || "Add Task"}
                </button>
              )}
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
