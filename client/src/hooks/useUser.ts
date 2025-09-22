import { useEffect, useState } from "react";
import { userService } from "@/api/services/userService";
import type { User } from "@/types/auth";

type Error = {
  message: string;
  status?: number;
} | null;

export function useUsers() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.list();
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
