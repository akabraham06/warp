import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from 'styled-components';
import { twooTheme } from './styles/twooTheme';
import { TwooGlobalStyles } from './styles/TwooGlobalStyles';

// Components
import TwooHeader from './components/TwooHeader';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import TwooLandingPage from './pages/TwooLandingPage';
import TwooDashboard from './pages/TwooDashboard';
import TwooLogin from './pages/TwooLogin';

function App() {
  return (
    <ThemeProvider theme={twooTheme}>
      <TwooGlobalStyles />
      <AuthProvider>
        <Router>
          <div className="App">
            <TwooHeader />
            <Routes>
              <Route path="/" element={<TwooLandingPage />} />
              <Route path="/login" element={<TwooLogin />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <TwooDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#000',
                  color: '#fff',
                  border: '1px solid #767676',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;