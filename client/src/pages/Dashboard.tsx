import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { PageContainer } from "@/components/pages/PageContainer";
import { type Task, type TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/kanban/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Dashboard() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // Mock data for tasks
  const [tasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Create UI components",
      description: "Design and implement reusable UI components",
      status: "todo",
      priority: "high",
      labels: ["design", "feature"],
      assignees: [
        { id: "user-1", name: "Alice Smith", avatar: "/avatars/alice.jpg" },
        { id: "user-2", name: "Bob Johnson", avatar: "/avatars/bob.jpg" },
      ],
      dueDate: "2023-12-15",
      comments: 3,
    },
    {
      id: "task-2",
      title: "Implement authentication",
      description: "Set up user authentication flow",
      status: "todo",
      priority: "medium",
      image: "https://placehold.co/600x400?text=Hello+World",
      labels: ["feature", "security"],
      assignee: {
        id: "user-3",
        name: "Charlie Davis",
        avatar: "/avatars/charlie.jpg",
      },
    },
    {
      id: "task-3",
      title: "Design database schema",
      description: "Create database models and relationships",
      status: "in-progress",
      priority: "high",
      labels: ["database", "design"],
      assignees: [
        { id: "user-1", name: "Alice Smith", avatar: "/avatars/alice.jpg" },
        { id: "user-4", name: "Diana Evans", avatar: "/avatars/diana.jpg" },
        { id: "user-5", name: "Ethan Brown", avatar: "/avatars/ethan.jpg" },
        { id: "user-6", name: "Fiona Clark", avatar: "/avatars/fiona.jpg" },
      ],
    },
    {
      id: "task-4",
      title: "Setup CI/CD pipeline",
      description: "Configure continuous integration and deployment",
      status: "in-progress",
      priority: "medium",
      labels: ["devops"],
      assignee: {
        id: "user-7",
        name: "George Hall",
        avatar: "/avatars/george.jpg",
      },
      comments: 2,
    },
    {
      id: "task-5",
      title: "Write unit tests",
      description: "Create tests for core functionality",
      status: "done",
      priority: "low",
      image: "https://placehold.co/600x400?text=Hello+World",
      labels: ["testing"],
      assignee: {
        id: "user-2",
        name: "Bob Johnson",
        avatar: "/avatars/bob.jpg",
      },
      dueDate: "2023-12-01",
    },
    {
      id: "task-6",
      title: "Documentation",
      description: "Document API endpoints and component usage",
      status: "done",
      priority: "medium",
      labels: ["documentation"],
      assignee: {
        id: "user-4",
        name: "Diana Evans",
        avatar: "/avatars/diana.jpg",
      },
      comments: 5,
    },
    {
      id: "task-6",
      title: "Documentation",
      description: "Document API endpoints and component usage",
      status: "done",
      priority: "medium",
      labels: ["documentation"],
      assignee: {
        id: "user-4",
        name: "Diana Evans",
        avatar: "/avatars/diana.jpg",
      },
      comments: 5,
    },
  ]);

  // Define columns for Kanban board
  const columns = [
    { id: "todo", title: t("dashboard.kanban.todo") || "To Do" },
    {
      id: "in-progress",
      title: t("dashboard.kanban.inProgress") || "In Progress",
    },
    { id: "done", title: t("dashboard.kanban.done") || "Done" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // Get priority class based on priority level
  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <PageContainer title={t("app.sidebar.dashboard") || "Dashboard"}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">
            {t("dashboard.description") ||
              "Manage and track your project tasks"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4  overflow-hidden">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-card rounded-lg border shadow-sm flex flex-col h-max"
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-card z-10">
              <h3 className="font-semibold">{column.title}</h3>
              <div className="bg-muted text-muted-foreground text-xs font-medium rounded-full px-2 py-1">
                {getTasksByStatus(column.id as TaskStatus).length}
              </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
              {getTasksByStatus(column.id as TaskStatus).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  colorTheme={colorTheme}
                  getPriorityClass={getPriorityClass}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
