import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Layout } from "@/components/layout/Layout";
import Settings from "./pages/Settings";

// Define your routes
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
]);

// Export the RouterProvider component with your router configuration
export function Router() {
  return <RouterProvider router={router} />;
}
