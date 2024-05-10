import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez Routes et Route
import App from './App';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';


// Utilisez createRoot au lieu de ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
