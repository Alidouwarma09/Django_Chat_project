import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/Accueil';
import Connexion from "./pages/LoginScreen";
import Parametre from "./pages/Parametre";
import Inscription from "./pages/Inscription";
import './App.css';
import Videos from "./pages/Videos";
import Messages from "./pages/Message";
import { VideoProvider } from './compoment/VideoContext';
import Utilisateurs from "./pages/Utilisateurs";
import {useEffect} from "react";

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;

};

function App() {
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            // Couleur de la barre de statut pour Android
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#931a1a');
            }

            // Couleur de la barre de navigation pour Android
            document.body.style.backgroundColor = '#931a1a';
            document.body.style.height = '100vh';
        }
    }, []);
    return (
        <VideoProvider>
            <Router>
                <Routes>
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/parametre" element={<Parametre />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/message/:utilisateurId" element={<Messages />} />
                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route
                        path="/acceuil"
                        element={isAuthenticated() ? <Acceuil /> : <Navigate to="/connexion" />}
                    />
                    <Route path="/" element={<Navigate to="/acceuil" />} />
                </Routes>
            </Router>
        </VideoProvider>
    );
}

export default App;
