import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-nightsky">
          <AppRoutes />
          <Toaster />
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;