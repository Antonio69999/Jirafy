import { useState } from "react";
import { useCreateIssue } from "./useIssue";
import { useIssueTypes, useIssuePriorities } from "./useIssueMetadata";
import { useAvailableStatuses } from "./useStatus"; // Nouveau hook
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { Issue } from "@/types/issue";

export function useQuickCreateIssue() {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthStore();
  const { create, loading: createLoading, error } = useCreateIssue();

  // Récupérer les métadonnées nécessaires
  const { data: issueTypes } = useIssueTypes();
  const { data: issueStatuses } = useAvailableStatuses(); // Utiliser le nouveau hook
  const { data: issuePriorities } = useIssuePriorities();

  const quickCreate = async (params: {
    title: string;
    projectId: number;
    statusKey: string;
  }): Promise<Issue | null> => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une tâche");
      return null;
    }

    if (!issueTypes || !issueStatuses || !issuePriorities) {
      console.log("Metadata not loaded:", {
        issueTypes,
        issueStatuses,
        issuePriorities,
      }); // Debug
      toast.error("Impossible de charger les métadonnées");
      return null;
    }

    setIsCreating(true);

    try {
      const taskType = issueTypes.find((t) => t.key === "TASK");
      const status = issueStatuses.find((s) => s.key === params.statusKey);
      const defaultPriority = issuePriorities.find((p) => p.key === "MEDIUM");

      if (!taskType || !status || !defaultPriority) {
        console.error("Metadata missing:", {
          taskType,
          status,
          defaultPriority,
        }); // Debug
        toast.error("Configuration des métadonnées incomplète");
        return null;
      }

      const issueData = {
        project_id: params.projectId,
        type_id: taskType.id,
        status_id: status.id,
        priority_id: defaultPriority.id,
        reporter_id: user.id,
        assignee_id: undefined,
        title: params.title,
        description: null,
        story_points: null,
        due_date: null,
      };

      const result = await create(issueData);

      if (result) {
        toast.success("Tâche créée avec succès");
        return result;
      }

      return null;
    } catch (err) {
      console.error("Erreur lors de la création rapide:", err);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    quickCreate,
    isCreating: isCreating || createLoading,
    error,
  };
}
