import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/utilisateurs.css";
import BottomTab from "./BottomTab";
import NavBar from "./NavBar";

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
    <div>
<NavBar/>
      <ul className="user-list">
        <li className="content-message-title"><span>Recent</span></li>
        {utilisateurs.map((utilisateur, index) => (
          <li key={index}>
            <a onClick={() => handleUserClick(utilisateur.id)}>
              <img
                className="content-message-image"
                src={utilisateur.image}
                alt={`${utilisateur.nom} ${utilisateur.prenom}`}
              />
              <span className="content-message-info">
                <span className="content-message-name">{utilisateur.nom} {utilisateur.prenom}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
        < BottomTab/>
    </div>
  );
}

export default Utilisateurs;
