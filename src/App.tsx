import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainGamePage } from "./pages/MainGamePage";
import PreloaderPage from "./pages/PreloaderPage";
import AuthForm from "./components/AuthForm";
import UserProfilePage from "./pages/UserProfilePage";
import WelcomeScreen from "./pages/WelcomeScreen";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "./contexts/UserContext";

function App() {
  console.log("🔵 App: Rendering with routes");

  // Protect Routes based on user authentication
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useUser();
    return user?.isAuthenticated ? children : <Navigate to="/auth" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PreloaderPage />} />
        <Route path="/auth" element={<AuthForm />} />

        {/* Protected Routes */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <MainGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
