import { useTranslation } from "react-i18next";
import type { Task } from "@/types/task";

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const { t } = useTranslation();

  const tasksWithDates = tasks.filter((t) => t.dueDate);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.calendar.title") || "Calendar View"}
      </h2>

      {tasksWithDates.length === 0 ? (
        <p className="text-muted-foreground">
          {t("dashboard.calendar.noTasks") || "No tasks with due dates."}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasksWithDates.map((task) => (
            <li
              key={task.id}
              className="border rounded-md p-2 bg-card shadow-sm"
            >
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(task.dueDate!).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
