import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/parametre.css'

const Parametres = () => {
  const [themeSombre, setThemeSombre] = useState(false);

  useEffect(() => {
  }, []);
const handleDeconnexion = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${process.env.REACT_APP_API_URL}Model/Deconnexion/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    if (response.status === 200) {
      localStorage.removeItem('token');
      window.location.href = '/connexion/';
    }
  } catch (error) {
    console.error('Erreur lors de la tentative de déconnexion:', error);
  }
};

  return (
    <div className={`settings ${themeSombre ? 'dark-mode' : ''}`}>
      <div className="hauteur">
        <div className="hauteur-item">Followers</div>
        <div className="hauteur-item">Likes</div>
        <div className="hauteur-item">Partages</div>
      </div>
      <h1 className="settings-header">Paramètres <i className="fas fa-chevron-down"></i></h1>
      <ul className="settings-menu show">
        <li><span className="icon"><i className="fas fa-user-circle"></i></span>Profil & Comptes</li>
        <li><span className="icon"><i className="fas fa-lock"></i></span>Sécurité</li>
        <li><span className="icon"><i className="fas fa-shield-alt"></i></span>Confidentialité & Sécurité</li>
        <li><span className="icon"><i className="fas fa-credit-card"></i></span>Facturation & Abonnement</li>
      </ul>
      <h1 className="settings-header">Personnalisation <i className="fas fa-chevron-down"></i></h1>
      <ul className="settings-menu show">
        <li>
          <span className="icon"><i className="fas fa-moon"></i></span>Mode Sombre
          <label className="toggle">
            <input type="checkbox"  />
          </label>
        </li>
        <li>
          <span className="icon"><i className="fas fa-fingerprint"></i></span> Autoriser l'empreinte digitale
          <label className="toggle">
            <input type="checkbox"  />
          </label>
        </li>
      </ul>
      <h1 className="settings-header">Aide et assistance <i className="fas fa-chevron-down"></i></h1>
      <ul className="settings-menu show">
        <li><span className="icon"><i className="fas fa-question-circle"></i></span>Aide et support</li>
      </ul>
      <div className="cardreDeconnexion">
        <button onClick={handleDeconnexion}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Parametres;
