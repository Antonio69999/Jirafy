import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { PageContainer } from "@/components/pages/PageContainer";
import { type Task, type TaskStatus } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickStart } from "@/components/commons/QuickStart";
import { useSearchParams } from "react-router-dom";
import { DashboardTabs } from "@/components/kanban/DashboardTabs";
import { KanbanView } from "@/components/kanban/KanbanView";
import { ListView } from "@/components/kanban/ListView";
import { PlaceholderView } from "@/components/kanban/PlaceholderView";
import { ProjectHeader } from "@/components/kanban/ProjectHeader";

type TabType =
  | "summary"
  | "board"
  | "list"
  | "calendar"
  | "reports"
  | "settings"
  | "timeline";

export function Dashboard() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // État pour le projet actuel
  const [currentProject, setCurrentProject] = useState({
    id: "1",
    name: "Jirafy Development",
    key: "JFY",
    description: "Development of the Jirafy project management platform",
    color: "#4c9aff",
    lead: "Alice Smith",
  });

  // Gestion des onglets
  const [activeTab, setActiveTab] = useState<TabType>("board");

  // Récupérer le projet et l'onglet actif depuis l'URL
  useEffect(() => {
    const projectId = searchParams.get("project");
    const tab = searchParams.get("tab") as TabType;

    if (
      tab &&
      [
        "summary",
        "board",
        "list",
        "calendar",
        "reports",
        "settings",
        "timeline",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }

    // Ici vous récupéreriez les détails du projet si projectId existe
    // Pour l'exemple, nous gardons le projet par défaut
  }, [searchParams]);

  // Changer d'onglet
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    searchParams.set("tab", tab);
    setSearchParams(searchParams);
  };

  // États pour les tâches
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Fonction pour générer un ID unique
  const generateId = () => `task-${Math.floor(Math.random() * 10000)}`;

  // Fonctions pour gérer l'ajout de tâche
  const handleAddTask = (columnId: string) => {
    setEditingColumn(columnId);
    setNewTaskTitle("");
  };

  const handleCancelAdd = () => {
    setEditingColumn(null);
  };

  const handleSaveTask = (columnId: string) => {
    if (newTaskTitle.trim() === "") {
      handleCancelAdd();
      return;
    }

    // Créer une nouvelle tâche
    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle.trim(),
      status: columnId as TaskStatus,
      priority: "medium", // Valeur par défaut
      labels: [],
    };

    // Mise à jour des tâches
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setEditingColumn(null);
  };

  // Mock data for tasks
  const [tasks, setTasks] = useState<Task[]>([
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

  // Définition des colonnes
  const columns = [
    { id: "todo", title: t("dashboard.kanban.todo") || "To Do" },
    {
      id: "in-progress",
      title: t("dashboard.kanban.inProgress") || "In Progress",
    },
    { id: "done", title: t("dashboard.kanban.done") || "Done" },
  ];

  // Fonction pour obtenir la classe de priorité
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

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case "board":
        return (
          <KanbanView
            tasks={tasks}
            columns={columns}
            colorTheme={colorTheme}
            getPriorityClass={getPriorityClass}
            editingColumn={editingColumn}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            handleAddTask={handleAddTask}
            handleCancelAdd={handleCancelAdd}
            handleSaveTask={handleSaveTask}
          />
        );
      case "list":
        return (
          <ListView
            tasks={tasks}
            colorTheme={colorTheme}
            getPriorityClass={getPriorityClass}
          />
        );
      case "summary":
        return (
          <PlaceholderView title={t("dashboard.tabs.summary") || "Summary"} />
        );
      case "calendar":
        return (
          <PlaceholderView title={t("dashboard.tabs.calendar") || "Calendar"} />
        );
      case "reports":
        return (
          <PlaceholderView title={t("dashboard.tabs.reports") || "Reports"} />
        );
      case "settings":
        return (
          <PlaceholderView title={t("dashboard.tabs.settings") || "Settings"} />
        );
      case "timeline":
        return (
          <PlaceholderView title={t("dashboard.tabs.timeline") || "Timeline"} />
        );
      default:
        return <PlaceholderView title={activeTab} />;
    }
  };

  return (
    <PageContainer title={currentProject.name} compact className="p-0 sm:p-2">
      {/* En-tête du projet */}
      <ProjectHeader project={currentProject} colorTheme={colorTheme} />

      {/* Tabs de navigation */}
      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Contenu principal selon l'onglet */}
      <ScrollArea className="h-[calc(100vh-15rem)]">
        {renderTabContent()}
      </ScrollArea>

      <div className="fixed bottom-6 right-6">
        <QuickStart />
      </div>
    </PageContainer>
  );
}
