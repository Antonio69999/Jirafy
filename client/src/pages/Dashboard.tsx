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
import { useProject } from "@/hooks/useProject";
import { useProjectIssues } from "@/hooks/useIssue";
import { useQuickCreateIssue } from "@/hooks/useQuickCreateIssue";

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

  // Récupération du projet depuis l'URL
  const projectId = searchParams.get("project");
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useProject(projectId ? parseInt(projectId) : undefined);

  // Récupération des issues du projet
  const {
    data: issuesData,
    loading: issuesLoading,
    error: issuesError,
    refetch: refetchIssues,
  } = useProjectIssues(projectId ? parseInt(projectId) : 0, { per_page: 50 });

  const { quickCreate, isCreating } = useQuickCreateIssue();

  // État pour le projet actuel
  const [currentProject, setCurrentProject] = useState<{
    id: string;
    name: string;
    key: string;
    description: string;
    color: string;
    lead: string;
  } | null>(null);

  // État pour les tâches transformées
  const [tasks, setTasks] = useState<Task[]>([]);

  // Gestion des onglets
  const [activeTab, setActiveTab] = useState<TabType>("board");

  // États pour l'ajout de tâches
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Mettre à jour le projet actuel quand les données arrivent
  useEffect(() => {
    if (projectData) {
      setCurrentProject({
        id: String(projectData.id),
        name: projectData.name,
        key: projectData.key,
        description: projectData.description || "",
        color: "#3b82f6", // Couleur par défaut
        lead: projectData.lead?.name || "Non assigné",
      });
    } else {
      setCurrentProject(null);
    }
  }, [projectData]);

  // Récupérer l'onglet actif depuis l'URL
  useEffect(() => {
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
  }, [searchParams]);

  // Transformer les issues API vers le format Task
  useEffect(() => {
    if (issuesData?.data) {
      const transformedTasks: Task[] = issuesData.data.map((issue) => ({
        id: issue.issue_key,
        title: issue.title,
        description: issue.description || undefined,
        status: mapStatusToTaskStatus(issue.status?.key || "TODO"),
        priority: mapPriorityToTaskPriority(issue.priority?.key || "MEDIUM"),
        labels: issue.labels?.map((label) => label.name) || [],
        assignee: issue.assignee
          ? {
              id: String(issue.assignee.id),
              name: issue.assignee.name,
              email: issue.assignee.email,
            }
          : undefined,
        dueDate: issue.due_date || undefined,
        projectId: String(issue.project_id),
      }));
      setTasks(transformedTasks);
    } else {
      setTasks([]);
    }
  }, [issuesData]);

  // Fonctions de mapping
  const mapStatusToTaskStatus = (statusKey: string): TaskStatus => {
    switch (statusKey) {
      case "TODO":
        return "todo";
      case "IN_PROGRESS":
        return "in-progress";
      case "DONE":
        return "done";
      default:
        return "todo";
    }
  };

  const mapPriorityToTaskPriority = (
    priorityKey: string
  ): "low" | "medium" | "high" => {
    switch (priorityKey) {
      case "LOW":
        return "low";
      case "MEDIUM":
        return "medium";
      case "HIGH":
        return "high";
      case "URGENT":
        return "high";
      default:
        return "medium";
    }
  };

  const getStatusKeyFromColumn = (columnId: string): string => {
    switch (columnId) {
      case "todo":
        return "TODO";
      case "in-progress":
        return "IN_PROGRESS";
      case "done":
        return "DONE";
      default:
        return "TODO";
    }
  };

  // Handlers
  const handleTaskSuccess = () => {
    refetchIssues();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", tab);
    setSearchParams(newSearchParams);
  };

  const handleAddTask = (columnId: string) => {
    setEditingColumn(columnId);
    setNewTaskTitle("");
  };

  const handleCancelAdd = () => {
    if (!isCreating) {
      setEditingColumn(null);
      setNewTaskTitle("");
    }
  };
  const handleSaveTask = async (columnId: string, title: string) => {
    if (!projectId || !currentProject) {
      toast.error("Aucun projet sélectionné");
      return;
    }

    try {
      const statusKey = getStatusKeyFromColumn(columnId);
      const result = await quickCreate({
        title,
        projectId: parseInt(projectId),
        statusKey,
      });

      if (result) {
        // Réinitialiser l'état
        setEditingColumn(null);
        setNewTaskTitle("");

        // Rafraîchir les données
        handleTaskSuccess();
      }
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  // Configuration
  const columns = [
    { id: "todo", title: t("dashboard.kanban.todo") || "To Do" },
    {
      id: "in-progress",
      title: t("dashboard.kanban.inProgress") || "In Progress",
    },
    { id: "done", title: t("dashboard.kanban.done") || "Done" },
  ];

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
    if (issuesLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            {t("common.loading") || "Chargement des tâches..."}
          </p>
        </div>
      );
    }

    if (issuesError) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            {issuesError.message || "Erreur lors du chargement des tâches"}
          </p>
        </div>
      );
    }

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
            onTaskSuccess={handleTaskSuccess}
            isCreatingTask={isCreating}
          />
        );
      case "list":
        return (
          <ListView
            tasks={tasks}
            colorTheme={colorTheme}
            getPriorityClass={getPriorityClass}
            onTaskSuccess={handleTaskSuccess}
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

  // Gestion des états de chargement et d'erreur
  if (projectId && projectLoading) {
    return (
      <PageContainer
        title={t("common.loading") || "Chargement..."}
        compact
        className="p-0 sm:p-2"
      >
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center">
            <p className="text-muted-foreground">
              {t("common.loading") || "Chargement du projet..."}
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (projectId && projectError) {
    return (
      <PageContainer
        title={t("common.error") || "Erreur"}
        compact
        className="p-0 sm:p-2"
      >
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-500">
              {t("common.error") || "Erreur"}
            </h2>
            <p className="text-muted-foreground">
              {projectError.message || "Impossible de charger le projet"}
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Si aucun projet n'est sélectionné
  if (!projectId || !currentProject) {
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

      {/* Contenu principal */}
      <ScrollArea className="h-[calc(100vh-15rem)]">
        {renderTabContent()}
      </ScrollArea>

      <div className="fixed bottom-6 right-6">
        <QuickStart />
      </div>
    </PageContainer>
  );
}
