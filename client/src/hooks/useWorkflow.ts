import { useState, useEffect } from "react";
import {
  workflowService,
  type AvailableTransition,
} from "@/api/services/workflowService";
import { toast } from "sonner";

type Error = {
  message: string;
  status?: number;
} | null;

/**
 * Hook pour récupérer les transitions disponibles pour une issue
 */
export function useIssueTransitions(issueId: number | null) {
  const [data, setData] = useState<AvailableTransition[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    if (!issueId) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await workflowService.getAvailableTransitions(issueId);
        setData(result);
      } catch (err: any) {
        const error = {
          message: err.message || "Erreur lors du chargement des transitions",
          status: err.status,
        };
        setError(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issueId]);

  return { data, loading, error };
}

/**
 * Hook pour effectuer une transition
 */
export function usePerformTransition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const performTransition = async (issueId: number, transitionId: number) => {
    setLoading(true);
    setError(null);

    try {
      await workflowService.performTransition(issueId, transitionId);
      toast.success("Transition effectuée avec succès");
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la transition",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { performTransition, loading, error };
}
