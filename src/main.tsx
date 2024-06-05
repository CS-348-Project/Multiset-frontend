import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Root } from "./routes";
import "./index.css";
import OAuthCallback from './components/callbacks/OAuthCallback';

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="font-sans">
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
