import { useState, useEffect } from "react";
import {
  workflowService,
  type AvailableTransition,
} from "@/api/services/workflowService";
import { toast } from "sonner";

interface Error {
  message: string;
  status?: number;
}

export function useIssueTransitions(issueId: number | null) {
  const [data, setData] = useState<AvailableTransition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransitions = async () => {
    if (!issueId) {
      setData([]);
      return;
    }

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
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransitions();
  }, [issueId]);

  const refetch = () => {
    fetchTransitions();
  };

  return { data, loading, error, refetch };
}

export function usePerformTransition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performTransition = async (issueId: number, transitionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.performTransition(
        issueId,
        transitionId
      );
      toast.success("Transition effectuée avec succès");
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la transition",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { performTransition, loading, error };
}
