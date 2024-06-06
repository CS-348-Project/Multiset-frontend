import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Root } from "./routes";
import "./index.css";
import OAuthCallback from './components/callbacks/OAuthCallback';
import { Toaster } from "./components/ui/toaster";
import { Purchase } from "./routes/purchase";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="font-sans">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  </React.StrictMode>
);
