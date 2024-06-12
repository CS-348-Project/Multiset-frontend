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
import { Optimization } from "./routes/optimization";

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
  {
    path: "/optimization",
    element: <Optimization />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="font-sans">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  </React.StrictMode>
);
