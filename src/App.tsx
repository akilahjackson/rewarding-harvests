import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-nightsky">
        <AppRoutes />
        <Toaster />
      </div>
    </Router>
  );
};

export default App;