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
import { useEffect } from "react";

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

function App() {
    useEffect(() => {
        const goFullScreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            }
        };

        // Instead of calling goFullScreen immediately, you can call it in response to a user action.
        document.addEventListener('click', goFullScreen, { once: true });

        return () => {
            document.removeEventListener('click', goFullScreen);
        };
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
