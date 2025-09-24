import { useState } from "react";
import { useUpdateIssue } from "./useIssue";
import {
  useIssueTypes,
  useIssueStatuses,
  useIssuePriorities,
} from "./useIssueMetadata";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { Issue, IssueUpdate } from "@/types/issue";
import type { Task } from "@/types/task";

export function useQuickUpdateIssue() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const { update, loading: updateLoading, error } = useUpdateIssue();

  // Récupérer les métadonnées nécessaires
  const { data: issueTypes } = useIssueTypes();
  const { data: issueStatuses } = useIssueStatuses();
  const { data: issuePriorities } = useIssuePriorities();

  const quickUpdate = async (params: {
    issueId: number;
    updates: Partial<{
      title: string;
      description: string;
      statusKey: string;
      priorityKey: string;
      assigneeId: number;
      dueDate: string;
    }>;
  }): Promise<Issue | null> => {
    console.log("quickUpdate called with params:", params); // Debug

    if (!user) {
      toast.error("Vous devez être connecté pour modifier une tâche");
      return null;
    }

    if (!issueTypes || !issueStatuses || !issuePriorities) {
      toast.error("Impossible de charger les métadonnées");
      return null;
    }

    setIsUpdating(true);

    try {
      const updateData: IssueUpdate = {};

      // Mapper les mises à jour
      if (params.updates.title !== undefined) {
        updateData.title = params.updates.title;
      }

      if (params.updates.description !== undefined) {
        updateData.description = params.updates.description || null;
      }

      if (params.updates.statusKey) {
        const status = issueStatuses.find(
          (s) => s.key === params.updates.statusKey
        );
        if (status) {
          updateData.status_id = status.id;
        }
      }

      if (params.updates.priorityKey) {
        const priority = issuePriorities.find(
          (p) => p.key === params.updates.priorityKey
        );
        if (priority) {
          updateData.priority_id = priority.id;
        }
      }

      if (params.updates.assigneeId !== undefined) {
        updateData.assignee_id = params.updates.assigneeId || undefined;
      }

      if (params.updates.dueDate !== undefined) {
        updateData.due_date = params.updates.dueDate || null;
      }

      console.log("Calling update with:", params.issueId, updateData); // Debug

      const result = await update(params.issueId, updateData);

      if (result) {
        toast.success("Tâche mise à jour avec succès");
        return result;
      }

      return null;
    } catch (err) {
      console.error("Erreur lors de la mise à jour rapide:", err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction utilitaire pour mettre à jour le statut d'une tâche
  const updateTaskStatus = async (
    task: Task,
    newStatusKey: string
  ): Promise<Issue | null> => {
    // Extraire l'ID numérique depuis la clé (ex: "ABC-123" -> récupérer l'ID de l'issue)
    const issueId = await getIssueIdFromKey(task.id);
    if (!issueId) return null;

    return quickUpdate({
      issueId,
      updates: { statusKey: newStatusKey },
    });
  };

  // Fonction helper pour récupérer l'ID depuis la clé
  const getIssueIdFromKey = async (
    issueKey: string
  ): Promise<number | null> => {
    try {
      // Vous devrez implémenter cette logique selon votre API
      // Pour l'instant, supposons qu'on puisse extraire l'ID du context
      // ou faire un appel API pour récupérer l'issue par sa clé
      return null; // À implémenter
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID:", error);
      return null;
    }
  };

  return {
    quickUpdate,
    updateTaskStatus,
    isUpdating: isUpdating || updateLoading,
    error,
  };
}
