import { type Task } from "@/types/task";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tasks: Task[];
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
  onTaskSuccess?: () => void;
}

export function ListView({
  tasks,
  colorTheme,
  getPriorityClass,
}: ListViewProps) {
  const { t } = useTranslation();

  // Fonction pour obtenir le statut en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return t("dashboard.kanban.todo") || "À faire";
      case "in-progress":
        return t("dashboard.kanban.inProgress") || "En cours";
      case "done":
        return t("dashboard.kanban.done") || "Terminé";
      default:
        return status;
    }
  };

  // Fonction pour obtenir le label de priorité
  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case "high":
        return t("dashboard.addTask.priorities.high") || "Haute";
      case "medium":
        return t("dashboard.addTask.priorities.medium") || "Moyenne";
      case "low":
        return t("dashboard.addTask.priorities.low") || "Basse";
      default:
        return priority || "";
    }
  };

  return (
    <div className="px-1 pb-4">
      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">
                {t("dashboard.list.title") || "Titre"}
              </TableHead>
              <TableHead>{t("dashboard.list.status") || "Statut"}</TableHead>
              <TableHead>
                {t("dashboard.list.priority") || "Priorité"}
              </TableHead>
              <TableHead>
                {t("dashboard.list.labels") || "Étiquettes"}
              </TableHead>
              <TableHead>
                {t("dashboard.list.assignee") || "Assigné à"}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.list.dueDate") || "Échéance"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        task.status === "todo"
                          ? "bg-blue-500"
                          : task.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      )}
                    ></div>
                    <span>{getStatusLabel(task.status)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      getPriorityClass(task.priority),
                      "text-white"
                    )}
                  >
                    {getPriorityLabel(task.priority)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {task.labels?.map((label, idx) => (
                      <span
                        key={idx}
                        className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {task.assignee
                    ? task.assignee.name
                    : task.assignees
                    ? `${task.assignees.length} assignés`
                    : "-"}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
