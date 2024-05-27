import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/parametre.css'
import { useNavigate } from 'react-router-dom';
import {IoMdLogOut} from "react-icons/io";

const Parametres = () => {
      const navigate = useNavigate();

  useEffect(() => {
  }, []);
const handleDeconnexion = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/Model/Deconnexion/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    if (response.status === 200) {
      localStorage.removeItem('token');
      navigate('/connexion')
    }
  } catch (error) {
    console.error('Erreur lors de la tentatidsdsve de déconnexion:', error);
  }
};

  return (
      <div className="container">
          <div className="header">
              <img src="path-to-your-trash-icon.png" alt="Trash Icon"/>
              <h1>Aujourd'hui</h1>
              <p className="clean-status">Non nettoyé</p>
              <p className="clean-status">0B Nettoyage total</p>
              <button className="clean-btn">NETTOYER MAINTENANT</button>
          </div>

          <div className="grid">
              <div className="card">
                  <i className="material-icons">delete</i>
                  <p>Spams</p>
                  <p>Libérer votre espace de stockage</p>
              </div>
              <div className="card">
                  <i className="material-icons">memory</i>
                  <p>Booster le téléphone</p>
                  <p>RAM: 63%</p>
              </div>
              <div className="card">
                  <i className="material-icons">ac_unit</i>
                  <p>Refroidisseur de téléphone</p>
                  <p>Température : 33°C</p>
              </div>
              <div className="card">
                  <i className="material-icons">cleaning_services</i>
                  <p>Nettoyer les données d'applis</p>
                  <p>5 applis peuvent être nettoyées</p>
              </div>
              <div className="card">
                  <i className="material-icons">security</i>
                  <p>Antivirus</p>
                  <p>63 jours non analysés</p>
              </div>
              <div className="card">
                  <i className="material-icons">battery_saver</i>
                  <p>Économie d'énergie</p>
                  <p>Économiser la batterie</p>
              </div>
          </div>
          <div className="card" style={{marginTop: 10, fontSize: 20, color: "red"}} onClick={handleDeconnexion()}>
              <IoMdLogOut />
              Deconnexion
          </div>
      </div>
  );
};

export default Parametres;
