import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/Accueil';
import Connexion from "./pages/LoginScreen";
import Parametre from "./pages/Parametre";

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/parametre" element={<Parametre />} />
                <Route
                    path="/acceuil"
                    element={isAuthenticated() ? <Acceuil /> : <Navigate to="/connexion" />}
                />
                <Route path="/" element={<Navigate to="/acceuil" />} />
            </Routes>
        </Router>
    );
}

export default App;
