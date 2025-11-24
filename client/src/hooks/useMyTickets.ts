import { useEffect, useState } from "react";
import { issueService } from "@/api/services/issueService";
import type { Issue } from "@/types/issue";
import type { Paginated } from "@/types/common";

type Error = {
  message: string;
  status?: number;
} | null;

export function useMyTickets(params: { per_page?: number } = {}) {
  const [data, setData] = useState<Paginated<Issue> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getMyTickets(params);
      setData(result);
    } catch (err: any) {
      console.error("Error loading my tickets:", err);
      setError({
        message: err.message || "Une erreur est survenue",
        status: err.status,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchData };
}
