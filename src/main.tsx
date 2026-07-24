import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import App from "./App.tsx";
import "./index.css";
import { initMonitoring } from "@/lib/monitoring";

initMonitoring();

const root = createRoot(document.getElementById("root")!);

flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
