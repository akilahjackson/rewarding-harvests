import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './AppRoutes';
import { GameProvider } from './contexts/GameContext'; // Import GameContext

const App = () => {
  return (
    <Router>
      <GameProvider> {/* Wrap the app with GameProvider */}
        <div className="min-h-screen bg-nightsky">
          <AppRoutes />
          <Toaster />
        </div>
      </GameProvider>
    </Router>
  );
};

export default App;
