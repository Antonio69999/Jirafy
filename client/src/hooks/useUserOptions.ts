import { useEffect, useState } from "react";
import { userService } from "@/api/services/userService";
import type { User } from "@/types/auth";

type Error = {
  message: string;
  status?: number;
} | null;

export function useUserOptions() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.list();
        setData(result || []);
      } catch (err: any) {
        setError({
          message: err.message || "Erreur lors du chargement des utilisateurs",
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
