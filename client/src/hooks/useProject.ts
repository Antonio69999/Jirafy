import { useEffect, useState } from "react";
import { projectService } from "@/api/services/projectService";
import { usePermissions } from "./usePermissions";
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

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const { canCreateProject } = usePermissions();

  const create = async (payload: ProjectCreate): Promise<Project | null> => {
    if (!canCreateProject()) {
      setError({
        message: "Vous n'avez pas les permissions pour créer un projet",
        status: 403,
      });
      return null;
    }

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

  return { create, loading, error, canCreate: canCreateProject };
}

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const { canEditProject } = usePermissions();

  const update = async (
    id: number,
    payload: ProjectUpdate,
    project?: Project
  ): Promise<Project | null> => {
    if (!canEditProject(project)) {
      setError({
        message: "Vous n'avez pas les permissions pour modifier ce projet",
        status: 403,
      });
      return null;
    }

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

// Garder les autres hooks existants...
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
  }, [JSON.stringify(params)]);

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

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const { canDeleteProject } = usePermissions();

  const remove = async (id: number, project?: Project): Promise<boolean> => {
    if (!canDeleteProject(project)) {
      setError({
        message: "Vous n'avez pas les permissions pour supprimer ce projet",
        status: 403,
      });
      return false;
    }

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

export function useProjectActions() {
  const {
    create,
    loading: createLoading,
    error: createError,
    canCreate,
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
    canCreate,
  };
}
