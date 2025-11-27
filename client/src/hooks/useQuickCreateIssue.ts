import { useState } from "react";
import { useCreateIssue } from "./useIssue";
import { useIssueTypes, useIssuePriorities } from "./useIssueMetadata";
import { useAvailableStatuses } from "./useStatus"; // Nouveau hook
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { Issue } from "@/types/issue";

export function useQuickCreateIssue() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const quickCreate = async (data: {
    title: string;
    projectId: number;
    statusId: number; 
  }) => {
    setIsCreating(true);
    setError(null);

    try {
      // ✅ Créer l'issue avec statusId
      const result = await issueService.create({
        title: data.title,
        project_id: data.projectId,
        status_id: data.statusId,
        type_id: 1,
        priority_id: 2,
        description: "",
      });

      toast.success("Tâche créée avec succès");
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la création de la tâche",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { quickCreate, isCreating, error };
}
