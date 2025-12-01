import { useEffect, useState } from "react";
import {
  workflowService,
  type WorkflowTransition,
  type WorkflowValidation,
} from "@/api/services/workflowService";
import { toast } from "sonner";

type Error = {
  message: string;
  status?: number;
} | null;

export function useProjectWorkflow(projectId: number | null) {
  const [data, setData] = useState<WorkflowTransition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const refetch = async () => {
    if (!projectId) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching transitions for project:", projectId);
      const result = await workflowService.getProjectTransitions(projectId);
      console.log("Transitions loaded:", result);
      setData(result);
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors du chargement du workflow",
        status: err.status,
      };
      setError(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [projectId]);

  return { data, loading, error, refetch };
}

export function useCreateTransition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const create = async (data: {
    project_id: number;
    from_status_id: number;
    to_status_id: number;
    name: string;
    description?: string;
  }): Promise<WorkflowTransition | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.createTransition(data);
      toast.success("Transition créée avec succès");
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la création de la transition",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useDeleteTransition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await workflowService.deleteTransition(id);
      toast.success("Transition supprimée avec succès");
      return true;
    } catch (err: any) {
      const error = {
        message:
          err.message || "Erreur lors de la suppression de la transition",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

export function useValidateWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const validate = async (
    projectId: number
  ): Promise<WorkflowValidation | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.validateWorkflow(projectId);

      if (!result.valid) {
        toast.error("Le workflow contient des erreurs");
      } else if (result.warnings.length > 0) {
        toast.warning("Le workflow contient des avertissements");
      } else {
        toast.success("Workflow valide !");
      }

      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la validation du workflow",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validate, loading, error };
}
