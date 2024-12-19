import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainGamePage } from "./pages/MainGamePage";
import PreloaderPage from "./pages/PreloaderPage";
import AuthForm from "./components/AuthForm";
import UserProfilePage from "./pages/UserProfilePage";
import WelcomeScreen from "./pages/WelcomeScreen";
import { UserProvider } from "./contexts/UserContext";
import { StoreProvider } from "./contexts/StoreContext";

const App = () => {
  return (
    <StoreProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/preloader" element={<PreloaderPage />} />
            <Route path="/game" element={<MainGamePage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </StoreProvider>
  );
};

export default App;