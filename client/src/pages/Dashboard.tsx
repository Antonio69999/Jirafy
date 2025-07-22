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

  // État pour le projet actuel (vide par défaut)
  const [currentProject, setCurrentProject] = useState<{
    id: string;
    name: string;
    key: string;
    description: string;
    color: string;
    lead: string;
  } | null>(null);

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
    if (projectId) {
      // TODO: Charger les données du projet depuis l'API
      // setCurrentProject(await fetchProject(projectId));
    }
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

  // État pour les tâches (vide par défaut)
  const [tasks, setTasks] = useState<Task[]>([]);

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

  // Si aucun projet n'est sélectionné, afficher un message
  if (!currentProject) {
    return (
      <PageContainer
        title={t("dashboard.noProject") || "Dashboard"}
        compact
        className="p-0 sm:p-2"
      >
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {t("dashboard.selectProject") || "Sélectionnez un projet"}
            </h2>
            <p className="text-muted-foreground">
              {t("dashboard.selectProjectDescription") ||
                "Choisissez un projet pour commencer à travailler"}
            </p>
          </div>
        </div>
        <div className="fixed bottom-6 right-6">
          <QuickStart />
        </div>
      </PageContainer>
    );
  }

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
