import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Layout } from "@/components/layout/Layout";
import Settings from "./pages/Settings";
import { Dashboard } from "./pages/Dashboard";

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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
