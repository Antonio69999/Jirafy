import { useEffect, useState } from "react";
import { issueService } from "@/api/services/issueService";
import type { Paginated } from "@/types/common";
import type {
  Issue,
  IssueCreate,
  IssueUpdate,
  IssueListParams,
} from "@/types/issue";

type Error = {
  message: string;
  status?: number;
} | null;

export function useCreateIssue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const create = async (payload: IssueCreate): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.create(payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la création de l'issue",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateIssue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const update = async (
    id: number,
    payload: IssueUpdate
  ): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.update(id, payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la mise à jour de l'issue",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useIssues(params: IssueListParams = {}) {
  const [data, setData] = useState<Paginated<Issue> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.list(params);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [JSON.stringify(params)]);

  const refetch = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.list(params);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useProjectIssues(
  projectId: number,
  params: Omit<IssueListParams, "project_id"> = {}
) {
  const [data, setData] = useState<Paginated<Issue> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.getProjectIssues(projectId, params);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, JSON.stringify(params)]);

  const refetch = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.getProjectIssues(projectId, params);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useIssue(id: number | undefined) {
  const [data, setData] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.get(id);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const refetch = () => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.get(id);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useIssueByKey(key: string | undefined) {
  const [data, setData] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    if (!key) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.getByKey(key);
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  return { data, loading, error };
}

export function useDeleteIssue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await issueService.remove(id);
      return true;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la suppression de l'issue",
        status: err.status,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

export function useIssueActions() {
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateIssue();
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateIssue();
  const {
    remove,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteIssue();

  const loading = createLoading || updateLoading || deleteLoading;
  const error = createError || updateError || deleteError;

  return {
    create,
    update,
    remove,
    loading,
    error,
  };
}
