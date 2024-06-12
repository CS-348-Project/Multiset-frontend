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
import { GoogleOAuthProvider } from "@react-oauth/google";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="351079269408-cjr2v77v05pb1f6pqj1f3cb8v93k0s4t.apps.googleusercontent.com">
      <main className="font-sans">
        <RouterProvider router={router} />
        <Toaster />
      </main>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
