import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Root } from "./routes";
import "./index.css";
import OAuthCallback from "./components/callbacks/OAuthCallback";
import { Toaster } from "./components/ui/toaster";
import { Purchase } from "./routes/purchase";
import { Settlement } from "./routes/settlement";
import { Analytics } from "./routes/analytics";
import groupsRoutes from "./routes/groups";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/auth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/purchase",
    element: <Purchase />,
  },
  {
    path: "/settlement",
    element: <Settlement />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
  groupsRoutes,
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <main className="font-sans">
          <RouterProvider router={router} />
          <Toaster />
        </main>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
