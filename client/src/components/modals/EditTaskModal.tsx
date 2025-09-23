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
  onSuccess?: () => void;
  colorTheme: string;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSuccess,
  colorTheme,
}: EditTaskModalProps) {
  const { t } = useTranslation();

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

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
            {t("dashboard.editTask.title") || "Modifier la tâche"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("dashboard.editTask.description") ||
              "Apportez des modifications à cette tâche. Cliquez sur sauvegarder quand vous avez terminé."}
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
                  assignee: task.assignee
                    ? String(task.assignee.id)
                    : undefined,
                  labels: task.labels || [],
                  project: task.projectId || "1",
                }}
                onClose={onClose}
                onSuccess={handleSuccess}
              />
            </div>

            {/* Panneau latéral avec informations supplémentaires */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.editTask.info.title") ||
                    "Informations de la tâche"}
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-muted-foreground">ID: </span>
                    <span className="font-mono">{task.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Statut: </span>
                    <span className="capitalize">
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priorité: </span>
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.editTask.guidelines.title") ||
                    "Conseils d'édition"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Mettez à jour le titre pour refléter l'état actuel</p>
                  <p>• Ajoutez des détails dans la description</p>
                  <p>• Ajustez la priorité selon l'urgence</p>
                  <p>• Assignez la tâche à la bonne personne</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
