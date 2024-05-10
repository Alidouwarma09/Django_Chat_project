import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';  // Ajustez le chemin selon l'emplacement de votre fichier App
import Accueil from './pages/Accueil';  // Assurez-vous que le chemin est correct
import BottomTab from './pages/BottomTab'; // Assumez que le chemin est déjà correct

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/" element={<App />} />
      </Routes>
      <BottomTab />
    </Router>
  );
}

export default MainRouter;
