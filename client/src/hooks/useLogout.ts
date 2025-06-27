import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/api/services/authService";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import type { ApiResponse } from "@/types/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      clearAuth();
      toast.success("Déconnexion réussie ! À bientôt !");
      navigate("/login");
    },
    onError: (error: AxiosError<ApiResponse<never>>) => {
      console.error("Logout error:", error);

      // Même si l'API échoue, on déconnecte l'utilisateur côté client
      clearAuth();

      if (error.response?.status === 401) {
        // Token déjà expiré ou invalide
        toast.info("Session expirée, vous avez été déconnecté");
        navigate("/login");
      } else if (error.code === "NETWORK_ERROR") {
        toast.warning(
          "Erreur réseau, mais vous avez été déconnecté localement"
        );
        navigate("/login");
      } else {
        toast.warning(
          "Erreur lors de la déconnexion, mais vous avez été déconnecté localement"
        );
        navigate("/login");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
