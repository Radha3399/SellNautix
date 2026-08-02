import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import App from "./App";
import { Router } from "./router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
