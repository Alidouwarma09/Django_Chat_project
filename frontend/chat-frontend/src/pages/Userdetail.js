import React, { useEffect, useState } from 'react';
import './css/solde.css'
import './css/userdetails.css'
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Spinner } from "@chakra-ui/react";
import Icon from "antd/es/icon";
import { IoReloadSharp } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ModalImage from "react-modal-image";

function Userdetail() {
    const { utilisateurId } = useParams();
    const [utilisateurs, setUtilisateurs] = useState(null);
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
                    <Icon as={IoReloadSharp} className="loading-icon" />
                </Box>
            </div>
        );
    }

    return (
        <div className="details-container">
            <div className="profile">
                <header className="profile__header">
                    <div className="profile__highlight__wrapper">
                        <div className="profile__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-school" width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"/>
                                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"/>
                            </svg>
                            1760
                        </div>
                        Students
                    </div>
                    <div className="profile__avatar">
                        <ModalImage
                            small={utilisateurs.image_utilisateur}
                            large={utilisateurs.image_utilisateur}
                            alt={`${utilisateurs.nom_utilisateur} ${utilisateurs.prenom_utilisateur}`}
                        />
                    </div>
                    <div className="profile__highlight__wrapper">
                        <div className="profile__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coin"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                                <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/>
                                <path d="M12 7v10"/>
                            </svg>
                            149$ss
                        </div>
                        Hourly Rate
                    </div>
                </header>
                <div className="profile__name">
                    <h2>{utilisateurs.nom_utilisateur} {utilisateurs.prenom_utilisateur}<RiVerifiedBadgeFill style={{color: "blue", fontSize: 20, marginLeft: 10}} /></h2>
                    <p>Frontend/Fullstack Developer </p>
                </div>
                <ul className="social-links">
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-github" width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-linkedin"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/>
                                <path d="M8 11l0 5"/>
                                <path d="M8 8l0 .01"/>
                                <path d="M12 16l0 -5"/>
                                <path d="M16 16v-3a2 2 0 0 0 -4 0"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-twitter"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M22 4.01c-.75 .5 -1.5 .5 -2.25 .5c1.5 -1 1.5 -2.5 1.5 -2.5c-2 1.5 -4 2.5 -6 3c-2 -.5 -4 0 -5 2c-1 2 -.5 4 1 5c-3 0 -6 0 -9 -3c0 3 1.5 5 4.5 6c-1.5 0 -3 0 -4.5 -.5c0 3 2 5 5 6c-1.5 1.5 -5 1.5 -7.5 1.5c3 2 5 2 10 2c9 0 14 -7.5 14 -14v-1c1.5 -1 2.5 -2.5 3 -4.01z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="details">
                <div className="details__header">
                    <div className="details__header__line" />
                    <div className="details__header__text">
                        {utilisateurs.nom_utilisateur} {utilisateurs.prenom_utilisateur}
                    </div>
                </div>
                <div className="details__content">
                    <div className="details__highlight__wrapper">
                        <div className="details__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-briefcase"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2z"/>
                                <path d="M10 11v6"/>
                                <path d="M14 11v6"/>
                                <path d="M9 7v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                            Techstars Bootcamp
                        </div>
                        <div className="details__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24h24H0z" fill="none"/>
                                <path
                                    d="M12 11a2 2 0 1 0 -2 -2a2 2 0 0 0 2 2z"/>
                                <path
                                    d="M6.75 12.5c-3.75 -3.75 -2.7 -7.5 0.75 -7.5c2.25 0 4.5 1.5 5.25 2.25c0.75 -0.75 3 -2.25 5.25 -2.25c3.45 0 4.5 3.75 0.75 7.5c-2.25 2.25 -5.25 5.25 -6 6c-0.75 -0.75 -3.75 -3.75 -6 -6z"/>
                            </svg>
                            New York, USA
                        </div>
                    </div>
                    <div className="details__highlight__wrapper">
                        <div className="details__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-book"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M19 4h-10a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10"/>
                                <path d="M13 8h-7"/>
                                <path d="M13 12h-7"/>
                                <path d="M9 16h-3"/>
                                <path d="M15 4v16"/>
                            </svg>
                            5 Projects
                        </div>
                    </div>
                    <div className="details__highlight__wrapper">
                        <div className="details__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24h24H0z" fill="none"/>
                                <path
                                    d="M9 7a4 4 0 1 0 -4 4h1.5a2.5 2.5 0 0 1 5 0h1.5a4 4 0 1 0 -4 -4z"/>
                                <path
                                    d="M18 12h-2a2.5 2.5 0 0 0 -5 0h-2a4 4 0 1 0 8 0z"/>
                            </svg>
                            12 Collaborators
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Userdetail;
