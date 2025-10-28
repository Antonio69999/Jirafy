import { useEffect, useState, useCallback } from "react";
import { projectMemberService } from "@/api/services/projectMemberService";
import type { ProjectMember } from "@/types/project";

type Error = {
  message: string;
  status?: number;
} | null;

export function useProjectMembers(projectId: number | undefined) {
  const [data, setData] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  // Utiliser useCallback pour mémoriser fetchData
  const fetchData = useCallback(async () => {
    if (!projectId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await projectMemberService.list(projectId);
      setData(result);
    } catch (err: any) {
      console.error("Erreur lors du chargement des membres:", err);
      setError({
        message: err.message || "Une erreur est survenue",
        status: err.status,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]); // Dépendance: projectId

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dépendance: fetchData (qui dépend de projectId)

  const refetch = useCallback(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId, fetchData]);

  const addMember = useCallback(
    async (userId: number, role: string): Promise<boolean> => {
      if (!projectId) return false;

      setLoading(true);
      setError(null);
      try {
        const result = await projectMemberService.add(projectId, userId, role);
        setData(result);
        return true;
      } catch (err: any) {
        console.error("Erreur lors de l'ajout du membre:", err);
        setError({
          message: err.message || "Erreur lors de l'ajout du membre",
          status: err.status,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const updateRole = useCallback(
    async (userId: number, role: string): Promise<boolean> => {
      if (!projectId) return false;

      setLoading(true);
      setError(null);
      try {
        const result = await projectMemberService.updateRole(
          projectId,
          userId,
          role
        );
        setData(result);
        return true;
      } catch (err: any) {
        console.error("Erreur lors de la mise à jour du rôle:", err);
        setError({
          message: err.message || "Erreur lors de la mise à jour du rôle",
          status: err.status,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const removeMember = useCallback(
    async (userId: number): Promise<boolean> => {
      if (!projectId) return false;

      setLoading(true);
      setError(null);
      try {
        const result = await projectMemberService.remove(projectId, userId);
        setData(result);
        return true;
      } catch (err: any) {
        console.error("Erreur lors du retrait du membre:", err);
        setError({
          message: err.message || "Erreur lors du retrait du membre",
          status: err.status,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  return { data, loading, error, refetch, addMember, updateRole, removeMember };
}
