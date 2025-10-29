import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Settings from "@/pages/Settings";
import { Dashboard } from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Teams from "@/pages/Teams";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import MyTickets from "@/pages/MyTickets";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <App />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Layout>
          <Settings />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Layout>
          <Projects />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <Layout>
          <Teams />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-tickets",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyTickets />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
