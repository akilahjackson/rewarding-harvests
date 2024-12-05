import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PreloaderPage from './pages/PreloaderPage';
import { MainGamePage } from './pages/MainGamePage';
import AuthForm from './components/AuthForm';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreloaderPage />} />
        <Route path="/game" element={<MainGamePage />} />
        <Route path="/auth" element={<AuthForm onSuccess={() => window.location.href = '/game'} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;