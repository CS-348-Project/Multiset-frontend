import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";
import { Home, Root } from "./routes";
import "./index.css";
import { Toaster } from "./components/ui/toaster";
import { Purchase } from "./routes/purchase";
import SocialAuth from "./routes/social-auth/index";
import { Analytics } from "./routes/analytics";

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
    path: "/purchase",
    element: <Purchase />,
  },
  {
    path: "/auth",
    element: <SocialAuth />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
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
