import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Layout } from "@/components/layout/Layout";
import Settings from "@/pages/Settings";
import { Dashboard } from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Teams from "@/pages/Teams";
import Register from "@/pages/Register";
import Login from "@/pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: "/settings",
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: "/projects",
    element: (
      <Layout>
        <Projects />
      </Layout>
    ),
  },
  {
    path: "/teams",
    element: (
      <Layout>
        <Teams />
      </Layout>
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
