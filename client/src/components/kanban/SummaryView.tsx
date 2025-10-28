import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SummaryViewProps {
  tasksCount: number;
  doneCount: number;
}

export function SummaryView({ tasksCount, doneCount }: SummaryViewProps) {
  const { t } = useTranslation();
  const progress = tasksCount ? Math.round((doneCount / tasksCount) * 100) : 0;

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.summary.totalTasks") || "Total Tasks"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {tasksCount}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.summary.completed") || "Completed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold text-green-500">
          {doneCount} ({progress}%)
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.summary.progress") || "Progress"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
