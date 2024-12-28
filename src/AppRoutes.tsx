import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import PreloaderPage from './pages/PreloaderPage';

// Use React.lazy for lazy-loading components if needed
const MainGamePage = React.lazy(() => import('./pages/MainGamePage'));

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Suspense fallback={<PreloaderPage />}>
      <Routes>
        <Route path="/" element={<Navigate to="/preloader" replace />} />
        <Route path="/preloader" element={<PreloaderPage />} />
        <Route
          path="/game"
          element={user?.isAuthenticated ? <MainGamePage /> : <Navigate to="/preloader" replace />}
        />
        <Route path="*" element={<Navigate to="/preloader" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;