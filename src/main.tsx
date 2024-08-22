import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Root } from "./routes";
import "./index.css";
import OAuthCallback from "./components/callbacks/OAuthCallback";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "./routes/analytics";
import groupsRoutes from "./routes/groups";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileContextProvider } from "./context/profile-context";
import { CreateGroup } from "./routes/groups/create-group";
import { JoinGroup } from "./routes/groups/join_group";

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
    path: "new-group",
    element: <CreateGroup />,
  },
  {
    path: "/auth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/join-group/:share_code",
    element: <JoinGroup />,
  },
  groupsRoutes,
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ProfileContextProvider>
        <main className="font-sans">
          <RouterProvider router={router} />
          <Toaster />
        </main>
      </ProfileContextProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
