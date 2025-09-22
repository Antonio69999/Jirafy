import { useEffect, useState } from "react";
import { labelService } from "@/api/services/labelService";

interface Label {
  id: number;
  name: string;
  color: string;
  project_id: number;
}

type Error = {
  message: string;
  status?: number;
} | null;

// Hook pour tous les labels (gardé pour d'autres usages)
export function useLabels() {
  const [data, setData] = useState<Label[] | null>(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Hook pour les labels d'un projet spécifique
export function useProjectLabels(projectId: number | null) {
  const [data, setData] = useState<Label[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    if (!projectId) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await labelService.getByProject(projectId);
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
  }, [projectId]);

  return { data, loading, error };
}
