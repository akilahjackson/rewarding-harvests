import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App.tsx";
import { StoreProvider } from "@/contexts/StoreContext";
import { UserProvider } from "@/contexts/UserContext";
import "./index.css";

// Use BrowserRouter to enable routing
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <UserProvider>
        <BrowserRouter>  {/* Wrap the App component with BrowserRouter */}
          <App />
        </BrowserRouter>
      </UserProvider>
    </StoreProvider>
  </React.StrictMode>
);
