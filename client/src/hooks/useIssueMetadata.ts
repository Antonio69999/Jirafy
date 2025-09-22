import { useEffect, useState } from "react";
import { issueMetadataService } from "@/api/services/issueMetadataService";

interface IssueType {
  id: number;
  key: string;
  name: string;
}

interface IssueStatus {
  id: number;
  key: string;
  name: string;
  category: string;
}

interface IssuePriority {
  id: number;
  key: string;
  name: string;
  weight: number;
}

type Error = {
  message: string;
  status?: number;
} | null;

export function useIssueTypes() {
  const [data, setData] = useState<IssueType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueMetadataService.getTypes();
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

export function useIssueStatuses() {
  const [data, setData] = useState<IssueStatus[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueMetadataService.getStatuses();
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

export function useIssuePriorities() {
  const [data, setData] = useState<IssuePriority[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueMetadataService.getPriorities();
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
