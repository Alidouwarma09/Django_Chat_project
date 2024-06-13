import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/utilisateurs.css";
import {IoIosArrowBack} from "react-icons/io";
import BottomTab from "./BottomTab";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loaded, setLoaded] = useState(false); // Nouvelle variable d'état pour suivre si les utilisateurs sont déjà chargés
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        } else {
            // Vérifier s'il y a des utilisateurs dans le cache du navigateur
            const cachedUtilisateurs = JSON.parse(localStorage.getItem('utilisateurs'));
            if (cachedUtilisateurs) {
                setUtilisateurs(cachedUtilisateurs);
                setLoaded(true);
            } else {
                fetchUtilisateurs();
            }
        }
    }, [navigate]);

    useEffect(() => {
        if (!loaded) { // Charger les utilisateurs uniquement si ils ne sont pas déjà chargés
            fetchUtilisateurs();
        }
    }, [loaded]); // Déclencher le chargement des utilisateurs lorsque 'loaded' change

    const fetchUtilisateurs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/utilisateurs/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setUtilisateurs(response.data.utilisateurs);
            setLoaded(true);
            localStorage.setItem('utilisateurs', JSON.stringify(response.data.utilisateurs));
            setUtilisateurs(response.data.utilisateurs);
            setLoaded(true); // Marquer les utilisateurs comme chargés
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleUserClick = (utilisateurId) => {
        navigate(`/message/${utilisateurId}`);
        console.log(utilisateurId);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddUser = async (newUser) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Utilisateur/api/utilisateurs/`, newUser, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setUtilisateurs([...utilisateurs, response.data.utilisateur]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        }
    };

    const filteredUtilisateurs = utilisateurs.filter(utilisateur =>
        `${utilisateur.nom} ${utilisateur.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="messages-container">
            <div className="header">
                <h1 style={{display: "flex", alignItems: "center", gap: "15px"}}> <IoIosArrowBack onClick={handleGoBack} />Messages</h1>
                <input
                    type="text"
                    placeholder="Rechercher dans les messages"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div>
                <div className="messages-list">
                    {filteredUtilisateurs.map(utilisateur => (
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
            </div>
            <button className="new-message-button">+</button>
            <BottomTab/>
        </div>
    );
}

export default Utilisateurs;
