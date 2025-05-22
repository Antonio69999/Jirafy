import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Task } from "@/types/task";
import { useTranslation } from "react-i18next";
import CreateTaskForm from "@/components/forms/CreateTaskForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  colorTheme: string;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  colorTheme,
}: EditTaskModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[900px] max-h-[85vh] overflow-hidden border", // Changed from overflow-y-auto to overflow-hidden
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">
            {t("dashboard.editTask.title") || "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.editTask.description") ||
              "Make changes to this task. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-18rem)]">
          <div className="pr-4">
            {/* Padding à droite pour éviter que le contenu touche la scrollbar */}
            <CreateTaskForm
              isEditing={true}
              initialData={{
                title: task.title,
                description: task.description || "",
                priority: task.priority || "medium",
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                assignees:
                  task.assignees?.map((a) => a.id) || task.assignee?.id
                    ? [task.assignee?.id as string]
                    : [],
                labels: task.labels || [],
                project: task.projectId || "1",
              }}
              onClose={onClose}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
