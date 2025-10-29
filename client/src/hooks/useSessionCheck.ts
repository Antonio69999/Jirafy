import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/api/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useSessionCheck() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Vérifier la session toutes les 5 minutes
    const interval = setInterval(async () => {
      try {
        await authService.me();
      } catch (error: any) {
        if (error.response?.status === 401) {
          clearAuth();
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
          navigate("/login");
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, clearAuth, navigate]);
}
