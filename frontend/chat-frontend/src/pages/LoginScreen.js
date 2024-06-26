import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import Chater_logo from './icons/chater_logo.png'
import { FiPhone, FiLock } from 'react-icons/fi';

import './css/connexion.css'

function Connexion() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/acceuil');
        }
    }, [navigate]);

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
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/Utilisateur/Connexion/`, {
            username: username,
            password: password
        })
        .then(response => {
                if (response.status === 200) {
                   localStorage.setItem('token', response.data.token);
                  navigate('/acceuil')
                }
            localStorage.setItem('token', response.data.token);
        })
        .catch(error => {
            setLoading(false);
            console.error('Erreur lors de la connexion:', error.response || error);
            setSubmitError('Numéro ou mot de passe incorrect');

        });
    }

    return (
        <div className="contenu_connexion" >
            <div className="login-card-container" >
                <div className="login-card">
                    <div className="login-card-logo">
                        <img src={Chater_logo} alt="chater_logo" style={{width: '150px'}}/>
                    </div>
                    <div className="login-card-header">
                        <h1>Connexion</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="login-card-form">
                        <div className="form-item">
                            <span className="form-item-icon"><FiPhone /></span>
                            <input type="number" placeholder="Téléphone" id="phoneForm" autoFocus required
                                   name="username" value={username}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-item">
                            <span className="form-item-icon"><FiLock /></span>
                            <input type="password" placeholder="Mot de passe" id="passwordForm" required
                                   name="password"  value={password}
                                   onChange={handleChange}/>
                        </div>
                        {submitError && <div className="error-message">{submitError}</div>}
                        <button className="login-button" type="submit" id="submitButton" disabled={loading}>
                            {loading ? 'Chargement...' : 'Se connecter'}
                        </button>
                    </form>
                    <div className="login-card-footer">
                        Je n'ai pas de compte <Link to="/inscription">S'inscrire ?</Link>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Connexion;
