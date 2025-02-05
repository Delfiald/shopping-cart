import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./router/Routes.jsx";

const router = createBrowserRouter(Routes);

createRoot(document.getElementById("root")).render(
 <StrictMode>
  <RouterProvider router={router} />
 </StrictMode>
);
