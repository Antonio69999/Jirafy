import { useEffect, useState } from "react";
import { labelService, type Label } from "@/api/services/labelService";

type Error = {
  message: string;
  status?: number;
} | null;

/**
 * Hook pour récupérer tous les labels globaux
 */
export function useLabels() {
  const [data, setData] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await labelService.list();
        setData(result);
      } catch (err: any) {
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * Hook pour récupérer les labels disponibles pour un projet
 * (globaux + labels du projet)
 */
export function useProjectLabels(projectId: number | null) {
  const [data, setData] = useState<Label[]>([]); //  Initialiser avec un tableau vide
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    if (!projectId) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await labelService.getByProject(projectId);
        console.log(" Project labels loaded:", result);
        setData(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error("❌ Error loading project labels:", err);
        setError({
          message: err.message || "Une erreur est survenue",
          status: err.status,
        });
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, loading, error };
}
