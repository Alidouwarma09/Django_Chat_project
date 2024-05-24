import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/Accueil';
import Connexion from "./pages/LoginScreen";
import Parametre from "./pages/Parametre";
import Inscription from "./pages/Inscription";
import './App.css';
import Videos from "./pages/Videos";
import Messages from "./pages/Message";
import { VideoProvider } from './compoment/VideoContext';

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

function App() {
    return (
        <VideoProvider>
            <Router>
                <Routes>
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/parametre" element={<Parametre />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/messages" element={<Messages />} />
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
