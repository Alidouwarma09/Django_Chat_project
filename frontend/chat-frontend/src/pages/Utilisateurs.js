import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/utilisateurs.css";
import { IoIosArrowBack } from "react-icons/io";
import BottomTab from "./BottomTab";
import { FaUserCircle } from "react-icons/fa";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        } else {
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
        if (!loaded) {
            fetchUtilisateurs();
        }
    }, [loaded]);


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
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };


    const handleUserClick = async (utilisateurId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/Utilisateur/api/marquer_messages_lus/`,
                { utilisateur_id: utilisateurId },
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchUtilisateurs();
        } catch (error) {
            console.error('Erreur lors de la mise à jour des messages lus:', error);
        }
        navigate(`/message/${utilisateurId}`);
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

    function isImageExists(url) {
        const img = new Image();
        img.src = url;
        return img.complete || (img.height !== 0);
    }

    return (
        <div className="messages-container">
            <div className="header">
                <h1 style={{ display: "flex", alignItems: "center", gap: "15px" }}> <IoIosArrowBack onClick={handleGoBack} />Messages</h1>
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
                                {utilisateur.image && isImageExists(utilisateur.image)
                                    ? <img src={utilisateur.image} alt={`${utilisateur.nom} ${utilisateur.prenom}`} className="avatar-image" />
                                    : <FaUserCircle style={{ fontSize: 30 }} className="avatar-image" />}
                            </div>
                            <div className="message-content">
                                <div className="message-name">{utilisateur.nom} {utilisateur.prenom}</div>
                                <div className="message-count">
                                    {utilisateur.messages_recus > 0 && (
                                        <span>{utilisateur.messages_recus} {utilisateur.messages_recus > 1 ? 'nouveaux messages' : 'message reçu'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="new-message-button">+</button>
            <BottomTab />
        </div>
    );
}

export default Utilisateurs;
