// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext.jsx';
import 'regenerator-runtime/runtime';


import Navbar from './components/Navbar.jsx';
import ComponentsPage from './components/ComponentsPage.jsx';
import ApiPage from './components/ApiPage.jsx';
import UseReducerPage from './components/UseReducerPage.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import VoiceInput from './components/VoiceInput.jsx'; // Importar el nuevo componente
import InformesPage from './components/InformesPage.jsx';


const AppContent = () => {
  const { themeClass } = React.useContext(ThemeContext);
  const { user } = React.useContext(AuthContext);

  return (
    <div className={themeClass}>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/components" />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/useReducer" element={<UseReducerPage />} />
          <Route path="/voiceInput" element={<VoiceInput />} />
          <Route path="/informes" element={<InformesPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={ user ? <Profile /> : <Navigate to="/login" /> } 
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  </Router>
);

export default App;
