import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Import Context Providers
import { StoreProvider } from "@/contexts/StoreContext";
import { UserProvider } from "@/contexts/UserContext";

// Global Styles
import "./index.css";

// Render App
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </StoreProvider>
  </React.StrictMode>
);
