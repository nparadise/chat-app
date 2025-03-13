import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Router from "./Router.tsx";

import "./index.css";

axios.defaults.baseURL = "http://localhost:5000/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
