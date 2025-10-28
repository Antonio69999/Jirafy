import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import type { Task } from "@/types/task";

const COLORS = ["#3b82f6", "#facc15", "#22c55e"];

export function ReportsView({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation();
  const data = [
    {
      name: t("dashboard.kanban.todo") || "To Do",
      value: tasks.filter((t) => t.status === "todo").length,
    },
    {
      name: t("dashboard.kanban.inProgress") || "In Progress",
      value: tasks.filter((t) => t.status === "in-progress").length,
    },
    {
      name: t("dashboard.kanban.done") || "Done",
      value: tasks.filter((t) => t.status === "done").length,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.reports.title") || "Reports"}
      </h2>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
