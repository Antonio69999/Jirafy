import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/api/services/authService";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import type { ApiResponse, LoginData } from "@/types/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) =>
      authService.login(data.email, data.password),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      toast.success("Connexion réussie ! Bienvenue !");
      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiResponse<never>>) => {
      console.error("Login error:", error);

      if (error.response?.data) {
        const { message, errors } = error.response.data;

        if (errors && Object.keys(errors).length > 0) {
          // Afficher toutes les erreurs de validation
          Object.values(errors)
            .flat()
            .forEach((errorMessage) => {
              toast.error(errorMessage);
            });
        } else {
          toast.error(message || "Erreur lors de la connexion");
        }
      } else if (error.code === "NETWORK_ERROR") {
        toast.error(
          "Erreur de connexion au serveur. Vérifiez votre connexion."
        );
      } else {
        toast.error("Une erreur inattendue s'est produite");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
