import React, { useEffect, useState } from 'react';
import './css/userdetails.css';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Spinner } from "@chakra-ui/react";
import {IoOptionsSharp, IoReloadSharp} from "react-icons/io5";
import {RiSignalTowerFill, RiVerifiedBadgeFill} from "react-icons/ri";
import ModalImage from "react-modal-image";
import {FaEyeSlash, FaFacebookMessenger, FaLink, FaUserPlus} from "react-icons/fa";
import {IoMdArchive, IoMdArrowRoundBack} from "react-icons/io";
import Icon from "antd/es/icon";
import Popup from "../compoment/Popup";
import {MdOutlineFavorite, MdSaveAlt} from "react-icons/md";
import {SiAdblock} from "react-icons/si";

function Userdetail() {
    const { utilisateurId } = useParams();
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showPopup2, setShowPopup2] = useState(false);
    const [selectedPublicationId, setSelectedPublicationId] = useState(null);

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

    const handleLongPress3 = (publicationId) => {
        setSelectedPublicationId(publicationId);
        setShowPopup2(true);
    };
    const handleClickOutsidePopup2 = (event) => {
        if (!event.target.closest('.popup-container2')) {
            setShowPopup2(false);
        }
    };
    const handleLongPress4 = (utilisateurId) => {
        navigate(`/message/${utilisateurId}`);
    };
    const handleBackss = () => {
        navigate(-1);
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsidePopup2);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsidePopup2);
        };
    }, []);



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
            {showPopup2 && <div className="dark-overlay3"></div>}
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
                            <FaUserPlus className="elements" />
                        </span>
                    </li>
                    <li onClick={()=> handleLongPress3(utilisateur.id)}>
                        <span>
                            <IoOptionsSharp className="elements" />
                        </span>
                    </li>
                </ul>
                <ul className="social-links2">
                    <li onClick={() => handleLongPress4(utilisateur.id)}>
                        Message
                        <FaFacebookMessenger className="elements" />
                    </li>
                </ul>
            </div>
            <div id="tab1-content" className="tab-content tab-content--active">
                afficher les publication de lutilisateur ici
            </div>
            {showPopup2 &&
                <div className="popup-container2">
                    <div className="popup-conten2" >
                        <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><MdOutlineFavorite /></span>Favorie
                    </div>
                    <div className="popup-conten2" >
                        <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><IoMdArchive /></span>Masquer
                    </div>
                    <div className="popup-conten2" >
                             <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><SiAdblock /></span>Bloquer
                    </div>
                    <div className="popup-conten2" >
                        <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><RiSignalTowerFill /></span>Signaler
                    </div>
                </div>
            }
        </div>
    );
}

export default Userdetail;
