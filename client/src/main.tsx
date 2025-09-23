import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/commons/ThemeProvider.tsx";
import { Router } from "./router.tsx";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

// Initialiser l'auth au démarrage
useAuthStore.getState().initializeAuth();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
