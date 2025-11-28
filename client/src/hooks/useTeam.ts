import { useEffect, useState, useCallback } from "react";
import { teamService } from "@/api/services/teamService";
import type { Paginated } from "@/types/common";
import type {
  Team,
  TeamCreate,
  TeamUpdate,
  TeamListParams,
} from "@/types/team";

type Error = {
  message: string;
  status?: number;
} | null;

export function useTeams(params: TeamListParams = {}) {
  const [data, setData] = useState<Paginated<Team> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await teamService.list(params);
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
        const result = await teamService.list(params);
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

export function useTeam(id: number | undefined) {
  const [data, setData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await teamService.get(id);
      setData(result);
    } catch (err: any) {
      setError({
        message: err.message || "Une erreur est survenue",
        status: err.status,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export function useCreateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const create = async (payload: TeamCreate): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await teamService.create(payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la création de l'équipe",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const update = async (
    id: number,
    payload: TeamUpdate
  ): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await teamService.update(id, payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la mise à jour de l'équipe",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await teamService.remove(id);
      return true;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la suppression de l'équipe",
        status: err.status,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
