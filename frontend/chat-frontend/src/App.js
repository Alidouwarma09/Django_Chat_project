import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Acceuil from './pages/Accueil';
import Connexion from "./pages/LoginScreen";
import Inscription from "./pages/Inscription";
import './App.css';
import Videos from "./pages/Videos";
import Messages from "./pages/Message";
import { VideoProvider } from './compoment/VideoContext';
import Utilisateurs from "./pages/Utilisateurs";
import Recherche from "./pages/Recherche";
import Profile from "./pages/Profile";
import Exemple from "./pages/Exemple";
import Solde from "./pages/Solde";
import Userdetail from "./pages/Userdetail"

function App() {

    return (
        <VideoProvider>
            <Router>

                <Routes>
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/message/:utilisateurId" element={<Messages />} />
                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route path="/recherche" element={<Recherche />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/acceuil" element={<Acceuil />} />
                    <Route path="/solde" element={<Solde />} />
                    <Route path="/userdetails/:utilisateurId" element={<Userdetail />} />
                    <Route path="/exemplepage" element={<Exemple />} />
                    <Route path="/" element={<Navigate to="/acceuil" />} />
                </Routes>
            </Router>
        </VideoProvider>
    );
}

export default App;
