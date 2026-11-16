import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Season0 from "./Season0";
import "./season0.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Season0 />
  </StrictMode>
);
