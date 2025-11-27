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
import { CalendarView } from "@/components/kanban/CalendarView";
import { TimelineView } from "@/components/kanban/TimelineView";
import { ReportsView } from "@/components/kanban/ReportsView";
import { SettingsView } from "@/components/kanban/SettingsView";
import { SummaryView } from "@/components/kanban/SummaryView";
import ProjectMembersModal from "@/components/modals/ProjectMembersModal";
import { useProjectStatuses } from "@/hooks/useStatus";
import { toast } from "sonner";

type TabType =
  | "summary"
  | "board"
  | "list"
  | "calendar"
  | "reports"
  | "settings"
  | "timeline"
  | "members";

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

  // ✅ Récupération des statuts du projet
  const {
    data: projectStatuses,
    loading: statusesLoading,
    error: statusesError,
  } = useProjectStatuses(projectId ? parseInt(projectId) : null);

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

  // ✅ Mapper l'ID du statut vers le format de colonne
  const mapStatusIdToTaskStatus = (statusId: number): string => {
    return `status-${statusId}`;
  };

  // Fonctions de mapping
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

  // ✅ Transformation des issues en tâches avec les statuts du projet
  useEffect(() => {
    if (!issuesData?.data) {
      setTasks([]);
      return;
    }

    if (!projectStatuses || projectStatuses.length === 0) {
      console.log("⏳ Waiting for project statuses...");
      return;
    }

    console.log(
      "✅ Transforming tasks with project statuses:",
      projectStatuses
    );

    const transformedTasks: Task[] = issuesData.data.map((issue) => {
      const status = projectStatuses.find((s) => s.id === issue.status_id);

      console.log(
        `Task ${issue.key}: status_id=${issue.status_id}, status=${status?.name}`
      );

      return {
        id: issue.key,
        title: issue.title,
        description: issue.description || undefined,
        status: mapStatusIdToTaskStatus(issue.status_id), // ✅ Utiliser l'ID du statut
        statusId: issue.status_id, // ✅ Stocker l'ID pour référence
        priority: mapPriorityToTaskPriority(issue.priority?.key || "MEDIUM"),
        labels: issue.labels?.map((label) => label.name) || [],
        assignee: issue.assignee
          ? {
              id: String(issue.assignee.id),
              name: issue.assignee.name,
              email: issue.assignee.email,
              avatar: undefined,
            }
          : undefined,
        dueDate: issue.due_date || undefined,
        projectId: String(issue.project_id),
      };
    });

    console.log("✅ Tasks transformed:", transformedTasks);
    setTasks(transformedTasks);
  }, [issuesData, projectStatuses]);

  // Mettre à jour le projet actuel quand les données arrivent
  useEffect(() => {
    if (projectData) {
      setCurrentProject({
        id: String(projectData.id),
        name: projectData.name,
        key: projectData.key,
        description: projectData.description || "",
        color: "#3b82f6",
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

  // ✅ Générer les colonnes directement à partir des statuts du projet
  const columns =
    projectStatuses && projectStatuses.length > 0
      ? projectStatuses.map((status) => ({
          id: mapStatusIdToTaskStatus(status.id),
          title: status.name,
        }))
      : [
          { id: "status-1", title: t("dashboard.kanban.todo") || "À faire" },
          {
            id: "status-2",
            title: t("dashboard.kanban.inProgress") || "En cours",
          },
          { id: "status-3", title: t("dashboard.kanban.done") || "Terminé" },
        ];

  console.log("✅ Columns generated:", columns);

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

  // Handlers
  const handleTaskSuccess = () => {
    refetchIssues();
  };

  const handleTasksUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleRefreshData = () => {
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

  // ✅ Créer une tâche avec l'ID du statut extrait de la colonne
  const handleSaveTask = async (columnId: string, title: string) => {
    if (!projectId || !currentProject) {
      toast.error("Aucun projet sélectionné");
      return;
    }

    try {
      // Extraire l'ID du statut depuis columnId ("status-123" -> 123)
      const statusId = parseInt(columnId.replace("status-", ""));

      const result = await quickCreate({
        title,
        projectId: parseInt(projectId),
        statusId, // ✅ Utiliser statusId au lieu de statusKey
      });

      if (result) {
        setEditingColumn(null);
        setNewTaskTitle("");
        handleTaskSuccess();
      }
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const renderTabContent = () => {
    if (issuesLoading || statusesLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            {t("common.loading") || "Chargement..."}
          </p>
        </div>
      );
    }

    if (issuesError || statusesError) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            {issuesError?.message ||
              statusesError?.message ||
              "Erreur lors du chargement"}
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
            onTaskUpdate={handleTasksUpdate}
            onRefreshData={handleRefreshData}
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
          <SummaryView
            tasksCount={tasks.length}
            doneCount={
              tasks.filter((t) => {
                // Trouver le statut correspondant
                const statusId = parseInt(t.status.replace("status-", ""));
                const status = projectStatuses?.find((s) => s.id === statusId);
                return status?.category === "done";
              }).length
            }
          />
        );
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "reports":
        return <ReportsView tasks={tasks} />;
      case "settings":
        return <SettingsView />;
      case "timeline":
        return <TimelineView tasks={tasks} />;
      case "members":
        return currentProject ? (
          <div className="px-1 pb-4">
            <ProjectMembersModal
              isOpen={true}
              onClose={() => handleTabChange("board")}
              project={{
                id: parseInt(currentProject.id),
                key: currentProject.key,
                name: currentProject.name,
                description: currentProject.description,
                issue_seq: 1,
                created_at: "",
                updated_at: "",
              }}
            />
          </div>
        ) : null;
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
