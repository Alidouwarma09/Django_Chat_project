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
import Icon from "antd/es/icon";

function Userdetail() {
    const { utilisateurId } = useParams();
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        }
    }, [navigate]);

    useEffect(() => {
        const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs'));
        console.log(utilisateurs)

            const foundUser = utilisateurs.find(user => user.id === parseInt(utilisateurId));
            if (foundUser) {
                setUtilisateur(foundUser);
                setTimeout(() => {
                    setInitialLoading(false);
                }, 500);
            } else {
                console.error('Utilisateur non trouvé');
            }

    }, [utilisateurId]);

    const handleBackss = () => {
        navigate(-1);
    };
    if (initialLoading) {
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
           <span className="bouton-de-retour">
                <IoMdArrowRoundBack size={30} onClick={handleBackss}  />
           </span>
            <div style={{ width: "100%"}}>
                <header className="profile__header" style={{ backgroundImage: `url(${utilisateur.image})`, backgroundSize: "cover" }}>
                    <div className="profile__highlight__wrapper">
                        Chater
                    </div>
                    <div className="profile__avatar">
                        <ModalImage
                            small={utilisateur.image}
                            large={utilisateur.image}
                            alt={`${utilisateur.nom} ${utilisateur.prenom} `}
                            hideDownload={true}
                            showRotate={false}
                        />
                    </div>
                    <div className="profile__highlight__wrapper">
                        Copyright
                    </div>
                </header>
                <div className="profile__name">
                    <h2>{utilisateur.nom} {utilisateur.prenom}<RiVerifiedBadgeFill style={{ color: "blue", fontSize: 20, marginLeft: 10 }} /></h2>
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
