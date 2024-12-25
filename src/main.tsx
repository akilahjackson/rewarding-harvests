import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StoreProvider } from "@/contexts/StoreContext";
import { UserProvider } from "@/contexts/UserContext";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <StoreProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </StoreProvider>
  </React.StrictMode>
);