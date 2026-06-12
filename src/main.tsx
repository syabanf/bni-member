import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/presentation/App";
import { ServicesProvider } from "@/presentation/providers/ServicesProvider";
import { AuthProvider } from "@/presentation/auth/AuthProvider";
import "@/presentation/styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ServicesProvider>
      <AuthProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ServicesProvider>
  </StrictMode>,
);
