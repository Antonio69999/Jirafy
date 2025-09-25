import { useEffect, useState } from "react";
import { statusService, type Status, type StatusCreate, type StatusUpdate, type StatusListParams } from "@/api/services/statusService";
import type { Paginated } from "@/types/common";
import { toast } from "sonner";

type Error = {
  message: string;
  status?: number;
} | null;

export function useCreateStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const create = async (payload: StatusCreate): Promise<Status | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await statusService.create(payload);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la création du statut",
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

export function useUpdateStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const update = async (id: number, payload: StatusUpdate): Promise<Status | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await statusService.update(id, payload);
      return result;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la mise à jour du statut",
        status: err.status,
      };
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await statusService.remove(id);
      return true;
    } catch (err: any) {
      const error = {
        message: err.message || "Erreur lors de la suppression du statut",
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

export function useStatuses(params: StatusListParams = {}) {
  const [data, setData] = useState<Paginated<Status> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await statusService.list(params);
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
        const result = await statusService.list(params);
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

export function useAvailableStatuses() {
  const [data, setData] = useState<Status[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await statusService.getAvailable();
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
  }, []);

  return { data, loading, error };
}

export function useStatus(id: number | undefined) {
  const [data, setData] = useState<Status | null>(null);
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
        const result = await statusService.get(id);
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

  return { data, loading, error };
}

export function useStatusByKey(key: string | undefined) {
  const [data, setData] = useState<Status | null>(null);
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
        const result = await statusService.getByKey(key);
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

export function useStatusActions() {
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateStatus();
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateStatus();
  const {
    remove,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteStatus();

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