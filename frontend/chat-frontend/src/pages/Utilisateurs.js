import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/utilisateurs.css";
import BottomTab from "./BottomTab";

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        }
    }, [navigate]);

 useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/utilisateurs/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setUtilisateurs(response.data.utilisateurs);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUtilisateurs();
  }, []);

const handleUserClick = (utilisateurId) => {
  navigate(`/message/${utilisateurId}`);
  console.log(utilisateurId)
};


  return (
      <div className="messages-container">
          <div className="header">
              <h1>Messages</h1>
              <input type="text" placeholder="Rechercher dans les messages" />
          </div>
          <div className="messages-list">
              {utilisateurs.map(utilisateur => (
                  <div key={utilisateur.id} className="message-item" onClick={() => handleUserClick(utilisateur.id)}>
                      <div className="message-avatar">
                          <img src={utilisateur.image} alt={`${utilisateur.nom} ${utilisateur.prenom}`} className="avatar-image" />
                      </div>
                      <div className="message-content">
                          <div className="message-name">{utilisateur.nom} {utilisateur.prenom}</div>
                      </div>
                  </div>
              ))}
          </div>
          <button className="new-message-button">+</button>
      </div>
  );
}
export default Utilisateurs;
