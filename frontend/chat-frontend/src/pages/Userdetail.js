import React, { useEffect, useState } from 'react';
import './css/userdetails.css';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Spinner } from "@chakra-ui/react";
import { IoReloadSharp } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ModalImage from "react-modal-image";
import { FaFacebookMessenger, FaLink } from "react-icons/fa";
import {IoMdArrowRoundBack} from "react-icons/io";

function Userdetail() {
    const { utilisateurId } = useParams();
    const [utilisateurs, setUtilisateurs] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            if (!utilisateurId) {
                console.error('ID d\'utilisateur manquant dans l\'URL');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/utilisateurs_select/${utilisateurId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setUtilisateurs(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        fetchUtilisateurs();
    }, [utilisateurId]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsHeaderVisible(false);
            } else {
                setIsHeaderVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleBackss = () => {
        navigate(-1);
    };
    if (!utilisateurs) {
        return (
            <div className="loading-container">
                <Box textAlign="center" mt="10" className="conversation-wrapper">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                        className="loading-container"
                    />
                    <IoReloadSharp className="loading-icon" />
                </Box>
            </div>
        );
    }

    return (
        <div className="details-container">
           <span className="bouton-de-retour">
                <IoMdArrowRoundBack size={30} onClick={handleBackss}  />
           </span>
            <div style={{ width: "100%"}}>
                <header className="profile__header" style={{ backgroundImage: `url(${utilisateurs.image_utilisateur})`, backgroundSize: "cover" }}>
                    <div className="profile__highlight__wrapper">
                        Chater
                    </div>
                    <div className="profile__avatar">
                        <ModalImage
                            small={utilisateurs.image_utilisateur}
                            large={utilisateurs.image_utilisateur}
                            alt={`${utilisateurs.nom_utilisateur} ${utilisateurs.prenom_utilisateur} `}
                            hideDownload={true}
                            showRotate={false}
                        />
                    </div>
                    <div className="profile__highlight__wrapper">
                        Copyright
                    </div>
                </header>
                <div className="profile__name">
                    <h2>{utilisateurs.nom_utilisateur} {utilisateurs.prenom_utilisateur}<RiVerifiedBadgeFill style={{ color: "blue", fontSize: 20, marginLeft: 10 }} /></h2>
                    <p>Compte professionnel/Musique</p>
                </div>
                <ul className="social-links">
                    <li>
                        <span>
                            <FaLink className="elements" />
                        </span>
                    </li>
                    <li>
                        <span>
                            <FaLink className="elements" />
                        </span>
                    </li>
                    <li>
                        <span>
                            <FaLink className="elements" />
                        </span>
                    </li>
                    <li>
                        <span>
                            <FaLink className="elements" />
                        </span>
                    </li>
                </ul>
                <ul className="social-links2">
                    <li>
                        Message
                        <FaFacebookMessenger className="elements" />
                    </li>
                </ul>
            </div>
            <div id="tab1-content" className="tab-content tab-content--active">
                afficher les publication de lutilisateur ici
            </div>
        </div>
    );
}

export default Userdetail;
