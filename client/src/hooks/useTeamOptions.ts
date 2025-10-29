import { useEffect, useState } from "react";
import { teamService } from "@/api/services/teamService";
import type { Team } from "@/types/team";

type Error = {
  message: string;
  status?: number;
} | null;

export function useTeamOptions() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await teamService.list({ per_page: 100 });
        setData(result.data || []);
      } catch (err: any) {
        setError({
          message: err.message || "Erreur lors du chargement des équipes",
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
