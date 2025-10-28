import { useTranslation } from "react-i18next";
import type { Task } from "@/types/task";

export function TimelineView({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation();
  const sorted = [...tasks]
    .filter((t) => t.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.timeline.title") || "Timeline"}
      </h2>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground">
          {t("dashboard.timeline.noTasks") || "No upcoming tasks."}
        </p>
      ) : (
        <ul className="border-l-2 border-muted pl-4 space-y-4">
          {sorted.map((task) => (
            <li key={task.id} className="relative">
              <span className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-primary"></span>
              <div className="font-medium">{task.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(task.dueDate!).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
