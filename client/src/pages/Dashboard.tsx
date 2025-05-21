import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { PageContainer } from "@/components/pages/PageContainer";
import { type Task, type TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/kanban/TaskCard";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.description") || "Manage and track your project tasks"}
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="grid auto-cols-[230px] grid-flow-col gap-3 pb-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-card rounded-md border shadow-sm flex flex-col h-full"
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

                {/* Bouton "Ajouter une tâche" en pointillés */}
                <button
                  className={cn(
                    "w-full p-2 border-2 border-dashed rounded-md mt-1.5",
                    "flex items-center justify-center gap-1.5",
                    "text-xs text-muted-foreground hover:text-foreground",
                    "hover:border-[var(--primary)] hover:bg-muted/30 transition-colors",
                    `theme-${colorTheme}`
                  )}
                  onClick={() => console.log(`Add task to ${column.id}`)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("dashboard.addTask") || "Add Task"}
                </button>
              </ScrollArea>
            </div>
          ))}
        </div>
      </ScrollArea>
    </PageContainer>
  );
}
