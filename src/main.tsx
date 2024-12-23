import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StoreProvider } from "@/contexts/StoreContext";
import { UserProvider } from "@/contexts/UserContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </StoreProvider>
  </React.StrictMode>
);