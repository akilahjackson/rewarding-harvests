import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import Index from './pages/Index';
import PreloaderPage from './pages/PreloaderPage';
import { MainGamePage } from './pages/MainGamePage';

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Suspense fallback={<PreloaderPage />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/game" 
          element={
            user?.isAuthenticated ? <MainGamePage /> : <Navigate to="/" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;