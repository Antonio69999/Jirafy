import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { Layout } from "@/components/Layout";

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
]);

// Export the RouterProvider component with your router configuration
export function Router() {
  return <RouterProvider router={router} />;
}
