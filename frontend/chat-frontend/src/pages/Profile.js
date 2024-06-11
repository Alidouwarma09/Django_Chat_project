import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { IoChevronBackSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import {CiEdit, CiUser} from "react-icons/ci";

const Profile = () => {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const loadUserInfo = async () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }
        };

        loadUserInfo();
    }, []);

    return (
        <div className="profile-container">
            <header className="header2">
                <div className="header-content">
                    <IoChevronBackSharp style={{ fontSize: 25 }} />
                    <h1>Profil utilisateur</h1>
                </div>
            </header>
            <div className="profile-info">
                <img
                    src={userInfo.image_utilisateu || 'default_image_path.jpg'}
                    alt="Profile"
                    className="profile-pic"
                />
                <div className="profile-details">
                    <div className="profile-item">
                        <CiUser />
                            <span className="label">Nom</span>
                        <span className="value">{userInfo.nom_utilisateur || 'Nom non défini'}</span>
                        <div className="note-container">
                            <p className="note">Ce n’est pas votre nom d’utilisateur. Ce nom sera visible par vos contacts chater.</p>
                            <CiEdit className="edit-icon" />
                        </div>
                    </div>
                    <div className="profile-item">
                        <CiUser />
                        <span className="label">Prénom</span>
                        <span className="value">{userInfo.prenom_utilisateur || 'Nom non défini'}</span>
                        <div className="note-container">
                            <p className="note">Ce n’est pas votre nom d’utilisateur. Ce nom sera visible par vos contacts chater.</p>
                            <CiEdit className="edit-icon" />
                        </div>
                    </div>
                    <div className="profile-item">
                        <span className="label">Infos</span>
                        <span className="value">En ligne le 07/03/2023</span>
                    </div>
                    <div className="profile-item">
                        <FaPhone />
                        <span className="label">Téléphone</span>
                        <span className="value">{userInfo.telephone || '+225 0789817277'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
