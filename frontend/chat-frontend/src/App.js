import React, { useState } from 'react';
import axios from 'axios';
import  { useNavigate }  from 'react-router-dom';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/Utilisateur/Connexion/`, {
            username: username,
            password: password
        })
        .then(response => {
            localStorage.setItem('token', response.data.token);
            setFormErrors({});
            navigate('/accueil');
        })
        .catch(error => {
            console.error('Erreur lors de la connexion:', error.response || error);
            if (error.response && error.response.data) {
                setFormErrors(error.response.data);
            }
        });
    }

    return (
        <div className="login-card-container" style={{  background: "linear-gradient(to right, #333399, #ff00cc)" }}>
            <div className="login-card">
                <div className="login-card-logo">
                    <img src="chater_logo.png" alt="chater_logo" style={{width:'150px'}} />
                </div>
                <div className="login-card-header">
                    <h1>Connexion</h1>
                    <div>Connectez-vous à l'aide du numéro entré lors de l'inscription</div>
                </div>
                <form onSubmit={handleSubmit} className="login-card-form">
                    <div className="form-item">
                        <span className="form-item-icon material-symbols-rounded">phone</span>
                        <input type="number" placeholder="Entrer numéro" id="phoneForm" autoFocus required name="username" className={formErrors.username ? 'error' : ''} value={username} onChange={handleChange} />
                    </div>
                    <div className="form-item">
                        <span className="form-item-icon material-symbols-rounded">lock</span>
                        <input type="password" placeholder="Enter Password" id="passwordForm" required name="password" className={formErrors.password ? 'error' : ''} value={password} onChange={handleChange} />
                    </div>
                    {(formErrors.username || formErrors.password) &&
                        <span id="errorMessage" style={{fontSize: '12px', color: 'red'}}>Numéro ou mot de passe incorrect !</span>
                    }
                    <button type="submit" id="submitButton">Se connecter</button>
                </form>
                <div className="login-card-footer">
                    Je n'ai pas de compte <a href="/inscription">S'inscrire ?</a>
                </div>
            </div>
        </div>
    );
}

export default App;
