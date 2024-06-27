import React, {useEffect, useState} from 'react';
import './css/userdetails.css'
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {Spinner} from "@chakra-ui/react";
import Icon from "antd/es/icon";
import {IoReloadSharp} from "react-icons/io5";
import {RiVerifiedBadgeFill} from "react-icons/ri";
import ModalImage from "react-modal-image";
import {FaFacebookMessenger, FaLink} from "react-icons/fa";

function Userdetail( ) {
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
        <div className="deatils-container">
            <header className="profile__header" style={{backgroundImage:  `url(${utilisateurs.image_utilisateur})`, backgroundSize: "cover"}}>
                <div className="profile__highlight__wrapper">
                    Chater
                </div>
                <div className="profile__avatar" >
                    <ModalImage
                        small={utilisateurs.image_utilisateur}
                        large={utilisateurs.image_utilisateur}
                        alt={`${utilisateurs.nom_utilisateur} ${utilisateurs.prenom_utilisateur} `}
                        hideDownload={true}
                        showRotate={false}
                    >
                    </ModalImage>
                </div>
                <div className="profile__highlight__wrapper">
                    Copyright
                </div>
            </header>



            <div className="profile__name">
                <h2>{utilisateurs.nom_utilisateur} {utilisateurs.prenom_utilisateur}<RiVerifiedBadgeFill style={{color: "blue", fontSize: 20, marginLeft: 10}} /></h2>
                <p>Compte proffessionnel/Musique </p>
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

            <div id="tab1-content" className="tab-content tab-content--active" >
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
                fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf <p>fdfrf rvr rvrg rgvr'gf rgvrg rg rg'gf rfgf </p>
            </div>

        </div>

    );
}

export default Userdetail;
