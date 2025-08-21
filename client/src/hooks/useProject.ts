import { useEffect, useMemo, useState } from "react";
import { projectService } from "@/api/services/projectService";
import type { Paginated } from "@/types/common";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListParams,
} from "@/types/project";

type Error = {
  message: string;
  status?: number;
} | null;

export function useProjects(params: ProjectListParams = {}) {
  const [data, setData] = useState<Paginated<Project> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await projectService.list(params);
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
  }, [JSON.stringify(params)]); // Utiliser JSON.stringify pour la comparaison d'objet

  const refetch = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await projectService.list(params);
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

// Hook pour récupérer un projet spécifique
export function useProject(id: number | undefined) {
  const [data, setData] = useState<Project | null>(null);
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
        const result = await projectService.get(id);
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
        const result = await projectService.get(id);
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

// Hook pour créer un projet
export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const create = async (payload: ProjectCreate): Promise<Project | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.create(payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la création du projet",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

// Hook pour mettre à jour un projet
export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const update = async (
    id: number,
    payload: ProjectUpdate
  ): Promise<Project | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.update(id, payload);
      return result;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la mise à jour du projet",
        status: err.status,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

// Hook pour supprimer un projet
export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await projectService.remove(id);
      return true;
    } catch (err: any) {
      setError({
        message: err.message || "Erreur lors de la suppression du projet",
        status: err.status,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hook générique pour les opérations CRUD
export function useProjectActions() {
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateProject();
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProject();
  const {
    remove,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteProject();

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
