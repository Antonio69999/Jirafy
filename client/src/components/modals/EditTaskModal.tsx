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
          "sm:max-w-[1300px] w-[90vw] max-h-[90vh] overflow-hidden border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {t("dashboard.editTask.title") || "Edit Task"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("dashboard.editTask.description") ||
              "Make changes to this task. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            <div className="lg:col-span-3">
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

            {/* Additional content area - takes 2/5 of the space on large screens */}
            <div className="lg:col-span-2 space-y-4">
              {/* Placeholder for additional components */}
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  Additional Details
                </h3>
                <div className="text-sm opacity-70">
                  Future components can be placed here
                </div>
              </div>

              {/* Another placeholder section */}
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">Related Items</h3>
                <div className="text-sm opacity-70">
                  Links, attachments, or other task metadata
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
