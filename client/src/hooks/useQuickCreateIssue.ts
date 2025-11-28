import { useState } from "react";
import { issueService } from "@/api/services/issueService";
import { toast } from "sonner";
import type { Issue } from "@/types/issue";
import { useAuthStore } from "@/store/authStore";

type Error = {
  message: string;
  status?: number;
} | null;

export function useQuickCreateIssue() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error>(null);
  const { user } = useAuthStore();

  const quickCreate = async (data: {
    title: string;
    projectId: number;
    statusId: number;
  }): Promise<Issue | null> => {
    if (!user) {
      const error = {
        message: "Vous devez être connecté pour créer une tâche",
        status: 401,
      };
      setError(error);
      toast.error(error.message);
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await issueService.create({
        title: data.title,
        project_id: data.projectId,
        status_id: data.statusId,
        type_id: 1,
        priority_id: 2,
        reporter_id: user.id,
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
